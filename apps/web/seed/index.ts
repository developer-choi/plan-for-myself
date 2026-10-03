import {getKoreanDate, type StudyRecord} from '@plan-for-myself/shared';
import pg from 'pg';
import {toRecordDate, toRecordTimestamp} from './date';
import {assertDevBranch} from './guard';
import {isScenarioName, SCENARIOS} from './scenario';

type SeedRow = Omit<StudyRecord, 'pk'> & {recordDate: string};

const [scenarioName = '', googleSub] = process.argv.slice(2);
if (!isScenarioName(scenarioName) || !googleSub) {
  throw new Error(`사용법: yarn workspace web db:seed <${Object.keys(SCENARIOS).join('|')}> <google_sub>`);
}

const connectionString = process.env.POSTGRES_URL_NON_POOLING;
if (!connectionString) {
  throw new Error(
    'POSTGRES_URL_NON_POOLING이 비어 있어 시드를 넣지 않는다. apps/web/.env.local에 개발 DB 주소를 넣는다',
  );
}

const {year, month, date} = getKoreanDate();
const rows = SCENARIOS[scenarioName]({year, month: month + 1, date}).map(({day, ...record}) => ({
  ...record,
  timestamp: toRecordTimestamp(day),
  recordDate: toRecordDate(day),
}));

replaceUserRecords(connectionString, googleSub, rows)
  .then(({userId, deletedCount, insertedCount}) => {
    process.stdout.write(
      `사용자 ${userId}: 기록 ${deletedCount}행을 지우고 ${scenarioName} 시나리오 ${insertedCount}행을 넣었다\n`,
    );
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });

async function replaceUserRecords(connectionString: string, googleSub: string, rows: SeedRow[]) {
  const client = new pg.Client({connectionString});
  await client.connect();

  try {
    const {
      rows: [{branchId}],
    } = await client.query<{
      /* Neon이 아닌 DB(localhost 등)에는 이 설정이 없어 null이다 */
      branchId: string | null;
    }>(`SELECT current_setting('neon.branch_id', true) AS "branchId"`);
    assertDevBranch(branchId);

    await client.query('BEGIN');
    await client.query('INSERT INTO users (google_sub) VALUES ($1) ON CONFLICT (google_sub) DO NOTHING', [googleSub]);
    const {
      rows: [{id: userId}],
    } = await client.query<{id: string}>('SELECT id FROM users WHERE google_sub = $1', [googleSub]);
    const deleted = await client.query('DELETE FROM study_records WHERE user_id = $1', [userId]);
    /* 따옴표가 없으면 Postgres가 이름을 소문자로 바꿔 camelCase JSON 키를 못 읽는다 */
    const inserted = await client.query(
      `INSERT INTO study_records (user_id, timestamp, record_date, date_type, studied_minutes, fail_tags)
       SELECT $1, record.timestamp, record."recordDate", record."dateType", record."studiedMinutes", record."failTags"
       FROM json_to_recordset($2::json)
         AS record(timestamp bigint, "recordDate" date, "dateType" varchar, "studiedMinutes" int[], "failTags" text[])`,
      [userId, JSON.stringify(rows)],
    );
    await client.query('COMMIT');

    return {userId, deletedCount: deleted.rowCount ?? 0, insertedCount: inserted.rowCount ?? 0};
  } catch (error) {
    await client.query('ROLLBACK').catch((rollbackError: unknown) => {
      console.error(rollbackError);
    });
    throw error;
  } finally {
    await client.end();
  }
}
