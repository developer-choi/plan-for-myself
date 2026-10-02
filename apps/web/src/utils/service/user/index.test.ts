// @vitest-environment node
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {beforeEach, describe, expect, it} from 'vitest';
import {findOrCreateUserId} from '.';

const CREATE_USERS_TABLE = readFileSync(
  new URL('../../../../migrations/1790924675472_create-users-and-link-study-records.sql', import.meta.url),
  'utf8',
).match(/CREATE TABLE users \([^;]*\);/)?.[0];

describe('findOrCreateUserId', () => {
  let db: PGlite;

  beforeEach(async () => {
    if (!CREATE_USERS_TABLE) {
      throw new Error('마이그레이션에서 users 테이블 정의를 찾지 못했다');
    }
    db = new PGlite();
    await db.exec(CREATE_USERS_TABLE);
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
