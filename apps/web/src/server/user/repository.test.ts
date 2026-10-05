// @vitest-environment node
import type {PGlite} from '@electric-sql/pglite';
import {beforeEach, describe, expect, it} from 'vitest';
import {countGuests, countStudyRecords, createTestDb, findUser, insertStudyRecord} from '@/server/db/test-db';
import {
  createGuestUserId,
  createGuestUserIdWithinLimit,
  deleteGuestUser,
  deleteUser,
  findGoogleLoginRows,
  findOrCreateUserId,
  GuestLimitError,
  linkGuestToGoogle,
} from './repository';

const recordDate = '2026-10-01';

describe('findOrCreateUserId', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('처음 로그인하는 구글 계정이면 사용자를 새로 만들고 그 ID를 돌려준다', async () => {
      const googleSub = 'sub-a';

      const id = await findOrCreateUserId(googleSub, db);

      const {rows} = await db.query<{id: string}>('SELECT id::text AS id FROM users WHERE google_sub = $1', [
        googleSub,
      ]);
      expect(rows).toEqual([{id}]);
    });

    it('이미 가입한 구글 계정으로 다시 로그인하면 사용자를 늘리지 않고 같은 ID를 돌려준다', async () => {
      const googleSub = 'sub-a';
      const first = await findOrCreateUserId(googleSub, db);

      const second = await findOrCreateUserId(googleSub, db);

      expect(second).toBe(first);
      const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM users');
      expect(rows[0].count).toBe(1);
    });
  });
});

describe('findGoogleLoginRows()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('게스트의 기록 유무와, 그 구글 계정으로 가입된 사용자 ID를 함께 돌려준다', async () => {
      const googleSub = 'sub-a';
      const guestUserId = await createGuestUserId(db);
      await insertStudyRecord(db, guestUserId, recordDate);
      await findOrCreateUserId('sub-b', db);
      const registeredUserId = await findOrCreateUserId(googleSub, db);

      const rows = await findGoogleLoginRows(guestUserId, googleSub, db);

      expect(rows).toEqual({guestHasRecords: true, registeredUserId});
    });
  });

  describe('Edge cases', () => {
    it('그 구글 계정으로 가입된 사용자가 없으면 사용자 ID가 비고, 다른 사용자의 기록은 이 게스트의 기록으로 세지 않는다', async () => {
      const guestUserId = await createGuestUserId(db);
      const otherUserId = await findOrCreateUserId('sub-b', db);
      await insertStudyRecord(db, otherUserId, recordDate);

      const rows = await findGoogleLoginRows(guestUserId, 'sub-a', db);

      expect(rows).toEqual({guestHasRecords: false, registeredUserId: null});
    });
  });
});

describe('linkGuestToGoogle()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('게스트를 구글 계정에 이으면 같은 사용자 ID 그대로 게스트가 아닌 사용자가 된다', async () => {
      const googleSub = 'sub-a';
      const guestUserId = await createGuestUserId(db);

      await linkGuestToGoogle(guestUserId, googleSub, db);

      expect(await findUser(db, guestUserId)).toEqual({isGuest: false, googleSub});
    });
  });

  describe('Edge cases', () => {
    it('이미 가입한 사용자에게 다른 구글 계정을 이으려 하면 기존 계정을 바꾸지 않고 실패한다', async () => {
      const googleSub = 'sub-a';
      const userId = await findOrCreateUserId(googleSub, db);

      await expect(linkGuestToGoogle(userId, 'sub-b', db)).rejects.toThrow(
        '게스트가 아닌 사용자에 구글 계정을 이으려 했다',
      );
      expect(await findUser(db, userId)).toEqual({isGuest: false, googleSub});
    });
  });
});

describe('deleteGuestUser()', () => {
  const deleteFailure = '지울 게스트가 없거나, 남기기로 한 기록이 있다';
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('기록 없는 게스트를 지운다', async () => {
      const guestUserId = await createGuestUserId(db);

      await deleteGuestUser(guestUserId, {withRecords: false}, db);

      expect(await findUser(db, guestUserId)).toBeUndefined();
    });

    it('기록까지 지우기로 하면 게스트와 그 기록을 지우고 다른 사용자의 기록은 그대로 둔다', async () => {
      const guestUserId = await createGuestUserId(db);
      await insertStudyRecord(db, guestUserId, recordDate);
      const otherUserId = await findOrCreateUserId('sub-a', db);
      await insertStudyRecord(db, otherUserId, recordDate);

      await deleteGuestUser(guestUserId, {withRecords: true}, db);

      expect(await findUser(db, guestUserId)).toBeUndefined();
      expect(await countStudyRecords(db, guestUserId)).toBe(0);
      expect(await countStudyRecords(db, otherUserId)).toBe(1);
    });
  });

  describe('Edge cases', () => {
    it('기록을 지우지 않기로 했는데 게스트에게 기록이 있으면 아무것도 지우지 않고 실패한다', async () => {
      const guestUserId = await createGuestUserId(db);
      await insertStudyRecord(db, guestUserId, recordDate);

      await expect(deleteGuestUser(guestUserId, {withRecords: false}, db)).rejects.toThrow(deleteFailure);
      expect(await findUser(db, guestUserId)).toEqual({isGuest: true, googleSub: null});
      expect(await countStudyRecords(db, guestUserId)).toBe(1);
    });

    it('게스트가 아닌 사용자는 기록까지 지우기로 해도 기록과 사용자를 남기고 실패한다', async () => {
      const googleSub = 'sub-a';
      const userId = await findOrCreateUserId(googleSub, db);
      await insertStudyRecord(db, userId, recordDate);

      await expect(deleteGuestUser(userId, {withRecords: true}, db)).rejects.toThrow(deleteFailure);
      expect(await findUser(db, userId)).toEqual({isGuest: false, googleSub});
      expect(await countStudyRecords(db, userId)).toBe(1);
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

      expect(await findUser(db, id)).toEqual({isGuest: true, googleSub: null});
      expect(await countGuests(db)).toBe(limit + 1);
    });
  });

  describe('Boundary cases', () => {
    it('같은 IP로 1시간 안에 30명을 만든 뒤의 요청은 거절하고 게스트를 더 만들지 않는다', async () => {
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

      expect(await findUser(db, id)).toEqual({isGuest: true, googleSub: null});
      expect(await countGuests(db)).toBe(1);
    });

    it('1시간이 지난 IP 기록은 다음 요청 때 정리된다', async () => {
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
  });

  describe('General cases', () => {
    it('사용자를 지우면 그 사용자의 기록만 함께 지워진다', async () => {
      const target = await findOrCreateUserId('sub-a', db);
      const other = await findOrCreateUserId('sub-b', db);
      await db.query('INSERT INTO study_records (user_id, record_date) VALUES ($1, $3), ($1, $3), ($2, $3)', [target, other, recordDate]);

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
      await db.query('INSERT INTO study_records (user_id, record_date) VALUES ($1, $2)', [other, recordDate]);
      const missingUserId = '999';

      await expect(deleteUser(missingUserId, db)).resolves.toBeUndefined();

      const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM study_records');
      expect(rows[0].count).toBe(1);
    });

    it('사용자를 지우다 실패하면 기록도 남는다', async () => {
      const target = await findOrCreateUserId('sub-a', db);
      await db.query('INSERT INTO study_records (user_id, record_date) VALUES ($1, $2), ($1, $2)', [target, recordDate]);
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
