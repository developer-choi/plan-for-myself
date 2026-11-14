import {eq, sql} from 'drizzle-orm';
import {assert} from 'vitest';
import type {Database} from '../db/database';
import {studyRecords, users} from '../db/schema';

export async function insertGuest(db: Database) {
  const [row] = await db.insert(users).values({isGuest: true}).returning({id: users.id});
  assert(row, '게스트를 넣었는데 돌아온 행이 없다');
  return row.id;
}

export async function insertGoogleUser(db: Database, googleSub: string) {
  const [row] = await db.insert(users).values({googleSub}).returning({id: users.id});
  assert(row, 'Google 사용자를 넣었는데 돌아온 행이 없다');
  return row.id;
}

export async function insertRecord(db: Database, userId: number) {
  await db.insert(studyRecords).values({
    userId,
    recordDate: '2026-09-01',
    timestamp: 0,
    dateType: 'weekday',
    studiedMinutes: [1, 0, 0],
    failTags: [],
  });
}

/**
 * null: 그 번호의 사용자 행이 없다
 */
export async function findUser(db: Database, id: number) {
  const [row] = await db
    .select({isGuest: users.isGuest, googleSub: users.googleSub})
    .from(users)
    .where(eq(users.id, id));
  return row ?? null;
}

/**
 * null: 탈퇴 표시가 없다
 * undefined: 그 번호의 사용자 행이 없다
 */
export async function findDeletedAt(db: Database, id: number) {
  const [row] = await db.select({deletedAt: users.deletedAt}).from(users).where(eq(users.id, id));
  return row?.deletedAt;
}

export async function insertRecordOnUserDelete(db: Database) {
  await db.execute(sql`
    CREATE FUNCTION insert_record_before_user_delete() RETURNS trigger AS $$
    BEGIN
      INSERT INTO study_records (user_id, record_date, timestamp, date_type, studied_minutes, fail_tags)
      VALUES (OLD.id, '2026-09-02', 0, 'weekday', '{1,0,0}', '{}');
      RETURN OLD;
    END $$ LANGUAGE plpgsql
  `);
  await db.execute(sql`
    CREATE TRIGGER insert_record_before_user_delete BEFORE DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION insert_record_before_user_delete()
  `);
}

export function findRecordOwners(db: Database, userId: number) {
  return db.select({userId: studyRecords.userId}).from(studyRecords).where(eq(studyRecords.userId, userId));
}
