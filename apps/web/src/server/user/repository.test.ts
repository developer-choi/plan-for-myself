// @vitest-environment node
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {beforeEach, describe, expect, it} from 'vitest';
import {createGuestUserId, findOrCreateUserId} from './repository';

const CREATE_USERS_TABLE = readFileSync(
  new URL('../../../migrations/1790924675472_create-users-and-link-study-records.sql', import.meta.url),
  'utf8',
).match(/CREATE TABLE users \([^;]*\);/)?.[0];

const ADD_GUEST_CHECK = readFileSync(
  new URL('../../../migrations/1791100597559_add-guest-check-to-users.sql', import.meta.url),
  'utf8',
).match(/-- Up Migration([^]*?)-- Down Migration/)?.[1];

async function createUsersDb() {
  if (!CREATE_USERS_TABLE || !ADD_GUEST_CHECK) {
    throw new Error('마이그레이션에서 users 테이블 정의나 제약을 찾지 못했다');
  }
  const db = new PGlite();
  await db.exec(CREATE_USERS_TABLE);
  await db.exec(ADD_GUEST_CHECK);
  return db;
}

describe('findOrCreateUserId', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createUsersDb();
  });

  it('처음 온 sub면 행을 새로 만들어 그 ID를 돌려준다', async () => {
    const id = await findOrCreateUserId('sub-a', db);

    const {rows} = await db.query<{id: string}>("SELECT id::text AS id FROM users WHERE google_sub = 'sub-a'");
    expect(rows).toEqual([{id}]);
  });

  it('같은 sub를 다시 넘기면 행을 늘리지 않고 같은 ID를 돌려준다', async () => {
    const first = await findOrCreateUserId('sub-a', db);
    const second = await findOrCreateUserId('sub-a', db);

    expect(second).toBe(first);
    const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM users');
    expect(rows[0].count).toBe(1);
  });

  it('다른 sub면 다른 ID를 돌려준다', async () => {
    const idA = await findOrCreateUserId('sub-a', db);
    const idB = await findOrCreateUserId('sub-b', db);

    expect(idB).not.toBe(idA);
  });
});

describe('createGuestUserId()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createUsersDb();
  });

  describe('General cases', () => {
    it('로그인 없이 시작할 때마다 구글 계정 없는 사용자를 새로 만든다', async () => {
      const first = await createGuestUserId(db);
      const second = await createGuestUserId(db);

      const {rows} = await db.query<{id: string; isGuest: boolean; googleSub: string | null}>(
        'SELECT id::text AS id, is_guest AS "isGuest", google_sub AS "googleSub" FROM users ORDER BY users.id',
      );
      expect(rows).toEqual([
        {id: first, isGuest: true, googleSub: null},
        {id: second, isGuest: true, googleSub: null},
      ]);
    });
  });
});

describe('사용자 저장 규칙', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createUsersDb();
  });

  describe('Edge cases', () => {
    it('구글 계정도 없고 로그인 없이 시작한 사용자도 아니면 저장되지 않는다', async () => {
      await expect(db.query('INSERT INTO users DEFAULT VALUES')).rejects.toThrow('users_is_guest_matches_google_sub');
    });

    it('구글 계정이 있는 사용자는 로그인 없이 시작한 사용자로 저장되지 않는다', async () => {
      await expect(db.query("INSERT INTO users (google_sub, is_guest) VALUES ('sub-a', true)")).rejects.toThrow(
        'users_is_guest_matches_google_sub',
      );
    });
  });
});
