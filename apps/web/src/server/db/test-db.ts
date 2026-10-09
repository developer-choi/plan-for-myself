import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';

const CREATE_USERS_TABLE = readFileSync(
  new URL('../../../migrations/1790924675472_create-users-and-link-study-records.sql', import.meta.url),
  'utf8',
).match(/CREATE TABLE users \([^;]*\);/)?.[0];

const ADD_GUEST_CHECK = readFileSync(
  new URL('../../../migrations/1791100597559_add-guest-check-to-users.sql', import.meta.url),
  'utf8',
).match(/-- Up Migration([^]*?)-- Down Migration/)?.[1];

/* study_records는 마이그레이션 도구를 들이기 전에 만든 테이블이라 CREATE가 어느 마이그레이션에도 없다. 사용자 FK(CASCADE 없음)만 손으로 재현한다 */
const CREATE_STUDY_RECORDS_TABLE = `
  CREATE TABLE study_records (
    pk serial PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES users (id),
    record_date date NOT NULL
  )
`;

export async function createTestDb() {
  if (!CREATE_USERS_TABLE || !ADD_GUEST_CHECK) {
    throw new Error('마이그레이션에서 users 테이블 정의나 제약을 찾지 못했다');
  }
  const db = new PGlite();
  await db.exec(CREATE_USERS_TABLE);
  await db.exec(ADD_GUEST_CHECK);
  await db.exec(CREATE_STUDY_RECORDS_TABLE);
  return db;
}

export async function insertStudyRecord(db: PGlite, userId: string, recordDate: string) {
  await db.query('INSERT INTO study_records (user_id, record_date) VALUES ($1, $2)', [userId, recordDate]);
}

export async function findUser(db: PGlite, userId: string) {
  const {rows} = await db.query<{
    isGuest: boolean;
    /** 게스트면 null */
    googleSub: string | null;
  }>('SELECT is_guest AS "isGuest", google_sub AS "googleSub" FROM users WHERE id = $1', [userId]);
  return rows.at(0);
}

export async function countStudyRecords(db: PGlite, userId: string) {
  const {rows} = await db.query<{count: number}>(
    'SELECT count(*)::int AS count FROM study_records WHERE user_id = $1',
    [userId],
  );
  return rows[0].count;
}

export async function countGuests(db: PGlite) {
  const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM users WHERE is_guest');
  return rows[0].count;
}
