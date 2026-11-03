// @vitest-environment node
import type {PGlite} from '@electric-sql/pglite';
import {beforeEach, describe, expect, it} from 'vitest';
import {countStudyRecords, createTestDb, findUser, insertStudyRecord} from '@/server/db/test-db';
import {
  createGuestUserId,
  deleteGuestUser,
  deleteUser,
  findGoogleLoginRows,
  findOrCreateUserId,
  linkGuestToGoogle,
} from './repository';

const recordDate = '2026-10-01';

describe('findOrCreateUserId()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('처음 로그인하는 구글 계정이면 사용자를 새로 만들어야 한다', async () => {
      await findOrCreateUserId('sub-a', db);

      const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM users');
      expect(rows[0].count).toBe(1);
    });

    it('처음 로그인하는 구글 계정이면 새로 만든 사용자의 ID를 반환해야 한다', async () => {
      const googleSub = 'sub-a';

      const id = await findOrCreateUserId(googleSub, db);

      const {rows} = await db.query<{id: string}>('SELECT id::text AS id FROM users WHERE google_sub = $1', [
        googleSub,
      ]);
      expect(rows).toEqual([{id}]);
    });

    it('이미 가입한 구글 계정으로 다시 로그인하면 사용자를 늘리지 않아야 한다', async () => {
      const googleSub = 'sub-a';
      await findOrCreateUserId(googleSub, db);

      await findOrCreateUserId(googleSub, db);

      const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM users');
      expect(rows[0].count).toBe(1);
    });

    it('이미 가입한 구글 계정으로 다시 로그인하면 처음과 같은 ID를 반환해야 한다', async () => {
      const googleSub = 'sub-a';
      const first = await findOrCreateUserId(googleSub, db);

      expect(await findOrCreateUserId(googleSub, db)).toBe(first);
    });
  });
});

describe('findGoogleLoginRows()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('아직 게스트이면 게스트로 남아 있음을 반환해야 한다', async () => {
      const guestUserId = await createGuestUserId(db);

      const {isStillGuest} = await findGoogleLoginRows(guestUserId, 'sub-a', db);

      expect(isStillGuest).toBe(true);
    });

    it('게스트에게 기록이 있으면 기록 있음을 반환해야 한다', async () => {
      const guestUserId = await createGuestUserId(db);
      await insertStudyRecord(db, guestUserId, recordDate);

      const {guestHasRecords} = await findGoogleLoginRows(guestUserId, 'sub-a', db);

      expect(guestHasRecords).toBe(true);
    });

    it('그 구글 계정으로 가입된 사용자가 있으면 그 사용자 ID를 반환해야 한다', async () => {
      const googleSub = 'sub-a';
      const guestUserId = await createGuestUserId(db);
      await findOrCreateUserId('sub-b', db);
      const registeredUserId = await findOrCreateUserId(googleSub, db);

      const rows = await findGoogleLoginRows(guestUserId, googleSub, db);

      expect(rows.registeredUserId).toBe(registeredUserId);
    });
  });

  describe('Edge cases', () => {
    it('이미 구글 계정에 이어진 사용자면 게스트로 남아 있지 않음을 반환해야 한다', async () => {
      const userId = await findOrCreateUserId('sub-b', db);

      const {isStillGuest} = await findGoogleLoginRows(userId, 'sub-a', db);

      expect(isStillGuest).toBe(false);
    });

    it('없는 사용자면 게스트로 남아 있지 않음을 반환해야 한다', async () => {
      const {isStillGuest} = await findGoogleLoginRows('999', 'sub-a', db);

      expect(isStillGuest).toBe(false);
    });

    it('그 구글 계정으로 가입된 사용자가 없으면 사용자 ID로 null을 반환해야 한다', async () => {
      const guestUserId = await createGuestUserId(db);

      const {registeredUserId} = await findGoogleLoginRows(guestUserId, 'sub-a', db);

      expect(registeredUserId).toBeNull();
    });

    it('다른 사용자에게만 기록이 있으면 게스트의 기록 없음을 반환해야 한다', async () => {
      const guestUserId = await createGuestUserId(db);
      const otherUserId = await findOrCreateUserId('sub-b', db);
      await insertStudyRecord(db, otherUserId, recordDate);

      const {guestHasRecords} = await findGoogleLoginRows(guestUserId, 'sub-a', db);

      expect(guestHasRecords).toBe(false);
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
    describe('이미 가입한 사용자에게 다른 구글 계정을 이으려 하면', () => {
      it('에러를 던져야 한다', async () => {
        const userId = await findOrCreateUserId('sub-a', db);

        await expect(linkGuestToGoogle(userId, 'sub-b', db)).rejects.toThrow(
          '게스트가 아닌 사용자에 구글 계정을 이으려 했다',
        );
      });

      it('기존 계정을 바꾸지 않아야 한다', async () => {
        const googleSub = 'sub-a';
        const userId = await findOrCreateUserId(googleSub, db);

        await expect(linkGuestToGoogle(userId, 'sub-b', db)).rejects.toThrow();

        expect(await findUser(db, userId)).toEqual({isGuest: false, googleSub});
      });
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
    it('기록 없는 게스트를 지우면 그 게스트가 남지 않아야 한다', async () => {
      const guestUserId = await createGuestUserId(db);

      await deleteGuestUser(guestUserId, {withRecords: false}, db);

      expect(await findUser(db, guestUserId)).toBeUndefined();
    });

    describe('기록까지 지우기로 하면', () => {
      it('게스트를 지워야 한다', async () => {
        const guestUserId = await createGuestUserId(db);
        await insertStudyRecord(db, guestUserId, recordDate);

        await deleteGuestUser(guestUserId, {withRecords: true}, db);

        expect(await findUser(db, guestUserId)).toBeUndefined();
      });

      it('게스트의 기록을 지워야 한다', async () => {
        const guestUserId = await createGuestUserId(db);
        await insertStudyRecord(db, guestUserId, recordDate);

        await deleteGuestUser(guestUserId, {withRecords: true}, db);

        expect(await countStudyRecords(db, guestUserId)).toBe(0);
      });

      it('다른 사용자의 기록은 그대로 둬야 한다', async () => {
        const guestUserId = await createGuestUserId(db);
        const otherUserId = await findOrCreateUserId('sub-a', db);
        await insertStudyRecord(db, otherUserId, recordDate);

        await deleteGuestUser(guestUserId, {withRecords: true}, db);

        expect(await countStudyRecords(db, otherUserId)).toBe(1);
      });
    });
  });

  describe('Edge cases', () => {
    describe('기록을 지우지 않기로 했을 때', () => {
      describe('게스트에게 기록이 있으면', () => {
        it('에러를 던져야 한다', async () => {
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await expect(deleteGuestUser(guestUserId, {withRecords: false}, db)).rejects.toThrow(deleteFailure);
        });

        it('게스트를 그대로 둬야 한다', async () => {
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await expect(deleteGuestUser(guestUserId, {withRecords: false}, db)).rejects.toThrow();

          expect(await findUser(db, guestUserId)).toEqual({isGuest: true, googleSub: null});
        });

        it('게스트의 기록을 그대로 둬야 한다', async () => {
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await expect(deleteGuestUser(guestUserId, {withRecords: false}, db)).rejects.toThrow();

          expect(await countStudyRecords(db, guestUserId)).toBe(1);
        });
      });
    });

    describe('게스트가 아닌 사용자에게', () => {
      describe('기록까지 지우기로 하면', () => {
        it('에러를 던져야 한다', async () => {
          const userId = await findOrCreateUserId('sub-a', db);

          await expect(deleteGuestUser(userId, {withRecords: true}, db)).rejects.toThrow(deleteFailure);
        });

        it('사용자를 그대로 둬야 한다', async () => {
          const googleSub = 'sub-a';
          const userId = await findOrCreateUserId(googleSub, db);

          await expect(deleteGuestUser(userId, {withRecords: true}, db)).rejects.toThrow();

          expect(await findUser(db, userId)).toEqual({isGuest: false, googleSub});
        });

        it('사용자의 기록을 그대로 둬야 한다', async () => {
          const userId = await findOrCreateUserId('sub-a', db);
          await insertStudyRecord(db, userId, recordDate);

          await expect(deleteGuestUser(userId, {withRecords: true}, db)).rejects.toThrow();

          expect(await countStudyRecords(db, userId)).toBe(1);
        });
      });
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
      await db.query('INSERT INTO study_records (user_id, record_date) VALUES ($1, $3), ($1, $3), ($2, $3)', [
        target,
        other,
        recordDate,
      ]);

      await deleteUser(target, db);

      const {rows} = await db.query<{users: string[]; owners: string[]}>(
        `SELECT (SELECT array_agg(id::text) FROM users) AS users,
                (SELECT array_agg(user_id::text) FROM study_records) AS owners`,
      );
      expect(rows[0]).toEqual({users: [other], owners: [other]});
    });
  });

  describe('Edge cases', () => {
    describe('이미 없는 사용자를 지우면', () => {
      it('에러를 던지지 않아야 한다', async () => {
        await expect(deleteUser('999', db)).resolves.toBeUndefined();
      });

      it('다른 사용자의 기록을 그대로 둬야 한다', async () => {
        const other = await findOrCreateUserId('sub-b', db);
        await insertStudyRecord(db, other, recordDate);

        await deleteUser('999', db);

        expect(await countStudyRecords(db, other)).toBe(1);
      });
    });

    describe('사용자를 지우다 실패하면', () => {
      it('에러를 던져야 한다', async () => {
        const target = await findOrCreateUserId('sub-a', db);
        await rejectUserDelete(db);

        await expect(deleteUser(target, db)).rejects.toThrow('users 삭제 거부');
      });

      it('사용자를 그대로 둬야 한다', async () => {
        const target = await findOrCreateUserId('sub-a', db);
        await rejectUserDelete(db);

        await expect(deleteUser(target, db)).rejects.toThrow();

        expect(await findUser(db, target)).toEqual({isGuest: false, googleSub: 'sub-a'});
      });

      it('사용자의 기록을 그대로 둬야 한다', async () => {
        const target = await findOrCreateUserId('sub-a', db);
        await insertStudyRecord(db, target, recordDate);
        await insertStudyRecord(db, target, recordDate);
        await rejectUserDelete(db);

        await expect(deleteUser(target, db)).rejects.toThrow();

        expect(await countStudyRecords(db, target)).toBe(2);
      });
    });
  });
});

async function rejectUserDelete(db: PGlite) {
  await db.exec(`
    CREATE FUNCTION reject_user_delete() RETURNS trigger AS $$
    BEGIN
      RAISE EXCEPTION 'users 삭제 거부';
    END;
    $$ LANGUAGE plpgsql;
    CREATE TRIGGER reject_user_delete AFTER DELETE ON users FOR EACH ROW EXECUTE FUNCTION reject_user_delete();
  `);
}
