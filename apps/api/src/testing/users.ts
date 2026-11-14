import {eq} from 'drizzle-orm';
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

export function findRecordOwners(db: Database, userId: number) {
  return db.select({userId: studyRecords.userId}).from(studyRecords).where(eq(studyRecords.userId, userId));
}
