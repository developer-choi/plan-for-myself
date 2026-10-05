// @vitest-environment node
import type {PGlite} from '@electric-sql/pglite';
import {beforeEach, describe, expect, it} from 'vitest';
import {countGuests, createTestDb} from '@/server/db/test-db';
import {
  createGuestUserId,
  createGuestUserIdWithinLimit,
  deleteUser,
  findOrCreateUserId,
  GuestLimitError,
} from './repository';

describe('findOrCreateUserId', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
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
    db = await createTestDb();
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

describe('createGuestUserIdWithinLimit()', () => {
  const limit = 30;
  const ipHash = 'ip-hash-a';
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  async function createGuestsUpToLimit(targetIpHash: string) {
    for (let index = 0; index < limit; index++) {
      await createGuestUserIdWithinLimit(targetIpHash, db);
    }
  }

  async function insertCreationsUpToLimit(ago: string) {
    await db.query(
      'INSERT INTO guest_creations (ip_hash, created_at) SELECT $1, now() - $2::interval FROM generate_series(1, $3::int)',
      [ipHash, ago, limit],
    );
  }

  describe('General cases', () => {
    it('한 IP가 한도에 닿아도 다른 IP는 게스트를 만들 수 있어야 한다', async () => {
      await createGuestsUpToLimit(ipHash);

      const id = await createGuestUserIdWithinLimit('ip-hash-b', db);

      expect(id).toEqual(expect.any(String));
      expect(await countGuests(db)).toBe(limit + 1);
    });
  });

  describe('Boundary cases', () => {
    it('같은 IP로 1시간 안에 30번째까지는 게스트를 만들어야 한다', async () => {
      const ids = [];
      for (let index = 0; index < limit; index++) {
        ids.push(await createGuestUserIdWithinLimit(ipHash, db));
      }

      expect(new Set(ids).size).toBe(limit);
      expect(await countGuests(db)).toBe(limit);
    });

    it('같은 IP의 31번째 요청은 거절하고 게스트를 만들지 않아야 한다', async () => {
      await createGuestsUpToLimit(ipHash);

      await expect(createGuestUserIdWithinLimit(ipHash, db)).rejects.toThrow(GuestLimitError);
      expect(await countGuests(db)).toBe(limit);
      const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM guest_creations');
      expect(rows[0].count).toBe(limit);
    });
  });

  describe('Edge cases', () => {
    it('59분 전에 30명을 만든 IP의 요청은 거절해야 한다', async () => {
      await insertCreationsUpToLimit('59 minutes');

      await expect(createGuestUserIdWithinLimit(ipHash, db)).rejects.toThrow(GuestLimitError);
      expect(await countGuests(db)).toBe(0);
    });

    it('2시간 전에 30명을 만든 IP는 다시 게스트를 만들 수 있어야 한다', async () => {
      await insertCreationsUpToLimit('2 hours');

      const id = await createGuestUserIdWithinLimit(ipHash, db);

      expect(id).toEqual(expect.any(String));
      expect(await countGuests(db)).toBe(1);
    });

    it('1시간이 지난 생성 기록은 지워져야 한다', async () => {
      await insertCreationsUpToLimit('2 hours');

      await createGuestUserIdWithinLimit(ipHash, db);

      const {rows} = await db.query<{count: number}>(
        "SELECT count(*)::int AS count FROM guest_creations WHERE created_at <= now() - interval '1 hour'",
      );
      expect(rows[0].count).toBe(0);
    });
  });
});

describe('사용자 저장 규칙', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
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

describe('deleteUser()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
    await db.exec('CREATE TABLE study_records (pk serial PRIMARY KEY, user_id bigint NOT NULL REFERENCES users (id))');
  });

  describe('General cases', () => {
    it('사용자를 지우면 그 사용자의 기록만 함께 지워진다', async () => {
      const target = await findOrCreateUserId('sub-a', db);
      const other = await findOrCreateUserId('sub-b', db);
      await db.query('INSERT INTO study_records (user_id) VALUES ($1), ($1), ($2)', [target, other]);

      await deleteUser(target, db);

      const {rows} = await db.query<{users: string[]; owners: string[]}>(
        `SELECT (SELECT array_agg(id::text) FROM users) AS users,
                (SELECT array_agg(user_id::text) FROM study_records) AS owners`,
      );
      expect(rows[0]).toEqual({users: [other], owners: [other]});
    });
  });

  describe('Edge cases', () => {
    it('이미 없는 사용자를 지우면 아무것도 지우지 않고 끝난다', async () => {
      const other = await findOrCreateUserId('sub-b', db);
      await db.query('INSERT INTO study_records (user_id) VALUES ($1)', [other]);
      const missingUserId = '999';

      await expect(deleteUser(missingUserId, db)).resolves.toBeUndefined();

      const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM study_records');
      expect(rows[0].count).toBe(1);
    });

    it('사용자를 지우다 실패하면 기록도 남는다', async () => {
      const target = await findOrCreateUserId('sub-a', db);
      await db.query('INSERT INTO study_records (user_id) VALUES ($1), ($1)', [target]);
      await db.exec(`
        CREATE FUNCTION reject_user_delete() RETURNS trigger AS $$
        BEGIN
          RAISE EXCEPTION 'users 삭제 거부';
        END;
        $$ LANGUAGE plpgsql;
        CREATE TRIGGER reject_user_delete AFTER DELETE ON users FOR EACH ROW EXECUTE FUNCTION reject_user_delete();
      `);

      await expect(deleteUser(target, db)).rejects.toThrow('users 삭제 거부');

      const {rows} = await db.query<{users: string[]; owners: string[]}>(
        `SELECT (SELECT array_agg(id::text) FROM users) AS users,
                (SELECT array_agg(user_id::text) FROM study_records) AS owners`,
      );
      expect(rows[0]).toEqual({users: [target], owners: [target, target]});
    });
  });
});
