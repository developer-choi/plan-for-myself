import type {StudyRecord} from '@plan-for-myself/shared';
import {pool} from '@/server/db/pool';
import type {NewStudyRecord, StudyRecordFields} from './validate';

interface Queryable {
  query(text: string, values: unknown[]): Promise<{rows: StudyRecord[]}>;
}

export type CreateResult = {ok: true; record: StudyRecord} | {ok: false; reason: 'DUPLICATE_DATE'};

/* range가 null이면 기간을 가리지 않고 본인 기록 전부를 돌려준다 */
export async function listStudyRecords(
  userId: string,
  range: {from: string; until: string} | null,
  db: Queryable = pool,
): Promise<StudyRecord[]> {
  const {rows} = await db.query(
    `SELECT ${COLUMNS} FROM study_records
     WHERE user_id = $1 AND ($2::date IS NULL OR (record_date >= $2::date AND record_date < $3::date))
     ORDER BY record_date`,
    [userId, range?.from ?? null, range?.until ?? null],
  );
  return rows;
}

export async function createStudyRecord(
  userId: string,
  record: NewStudyRecord,
  db: Queryable = pool,
): Promise<CreateResult> {
  try {
    /* timestamp는 시드의 toRecordTimestamp와 같은 값(그 날 한국 시간 13:00의 밀리초)을 DB에서 만든다 */
    const {
      rows: [created],
    } = await db.query(
      `INSERT INTO study_records (user_id, record_date, timestamp, date_type, studied_minutes, fail_tags)
       VALUES (
         $1, $2::date,
         (extract(epoch FROM ($2::date + time '13:00') AT TIME ZONE 'Asia/Seoul') * 1000)::bigint,
         $3, $4, $5
       )
       RETURNING ${COLUMNS}`,
      [userId, record.date, record.date_type, record.studied_minutes, record.fail_tags],
    );
    return {ok: true, record: created};
  } catch (error) {
    if (isDuplicateDateError(error)) {
      return {ok: false, reason: 'DUPLICATE_DATE'};
    }
    throw error;
  }
}

/* null: 그 pk의 기록이 없거나 다른 사용자의 기록이다 */
export async function updateStudyRecord(
  target: {userId: string; pk: number},
  fields: StudyRecordFields,
  db: Queryable = pool,
): Promise<StudyRecord | null> {
  const {rows} = await db.query(
    `UPDATE study_records SET date_type = $3, studied_minutes = $4, fail_tags = $5
     WHERE pk = $1 AND user_id = $2
     RETURNING ${COLUMNS}`,
    [target.pk, target.userId, fields.date_type, fields.studied_minutes, fields.fail_tags],
  );
  return rows[0] ?? null;
}

export async function deleteStudyRecord(userId: string, pk: number, db: Queryable = pool): Promise<boolean> {
  const {rows} = await db.query(`DELETE FROM study_records WHERE pk = $1 AND user_id = $2 RETURNING ${COLUMNS}`, [
    pk,
    userId,
  ]);
  return rows.length > 0;
}

/* bigint는 pg가 문자열로 돌려줘서 숫자로 받으려고 float8로 바꾼다. 밀리초 epoch는 float8에 정확히 담긴다 */
const COLUMNS = 'pk, date_type, studied_minutes, fail_tags, timestamp::float8 AS timestamp';
const UNIQUE_VIOLATION = '23505';
const DUPLICATE_DATE_CONSTRAINT = 'study_records_user_id_record_date_key';

/* 같은 UNIQUE 위반이라도 pk 충돌 같은 다른 제약이면 날짜 중복이 아니므로 그대로 던지게 한다 */
function isDuplicateDateError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === UNIQUE_VIOLATION &&
    'constraint' in error &&
    error.constraint === DUPLICATE_DATE_CONSTRAINT
  );
}
