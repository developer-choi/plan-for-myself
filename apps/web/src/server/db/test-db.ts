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

const CREATE_GUEST_CREATIONS_TABLE = readFileSync(
  new URL('../../../migrations/1791156539207_create-guest-creations.sql', import.meta.url),
  'utf8',
).match(/-- Up Migration([^]*?)-- Down Migration/)?.[1];

export async function createTestDb() {
  if (!CREATE_USERS_TABLE || !ADD_GUEST_CHECK || !CREATE_GUEST_CREATIONS_TABLE) {
    throw new Error('마이그레이션에서 users·guest_creations 테이블 정의나 제약을 찾지 못했다');
  }
  const db = new PGlite();
  await db.exec(CREATE_USERS_TABLE);
  await db.exec(ADD_GUEST_CHECK);
  await db.exec(CREATE_GUEST_CREATIONS_TABLE);
  return db;
}

export async function countGuests(db: PGlite) {
  const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM users WHERE is_guest');
  return rows[0].count;
}
