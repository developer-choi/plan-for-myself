// @vitest-environment node
import type {PGlite} from '@electric-sql/pglite';
import {beforeEach, describe, expect, it} from 'vitest';
import {decideGoogleLogin, type GoogleLoginFacts, resolveGoogleLogin, type RunInTransaction} from '@/auth/google-login';
import {countStudyRecords, createTestDb, findUser, insertStudyRecord} from '@/server/db/test-db';
import {createGuestUserId, findOrCreateUserId} from '@/server/user/repository';

describe('decideGoogleLogin()', () => {
  const guestUserId = 'guest-1';
  const registeredUserId = 'user-1';
  const guestFacts: GoogleLoginFacts = {
    guestUserId,
    guestHasRecords: false,
    registeredUserId: null,
    discardIntentValid: false,
  };

  describe('General cases', () => {
    it('게스트 세션이 없으면 구글 계정으로 사용자를 찾거나 만든다', () => {
      const decision = decideGoogleLogin({...guestFacts, guestUserId: null});

      expect(decision).toEqual({type: 'find-or-create'});
    });

    [true, false].forEach((guestHasRecords) => {
      it(`게스트가 처음 쓰는 구글 계정으로 로그인하면 게스트 사용자를 그 계정으로 잇는다 (${guestHasRecords ? '기록 있음' : '기록 없음'})`, () => {
        const decision = decideGoogleLogin({...guestFacts, guestHasRecords});

        expect(decision).toEqual({type: 'link', guestUserId});
      });
    });

    it('기록 없는 게스트가 가입된 계정으로 로그인하면 그 계정으로 들어가고 빈 게스트를 지운다', () => {
      const decision = decideGoogleLogin({...guestFacts, registeredUserId});

      expect(decision).toEqual({type: 'switch-delete-empty-guest', guestUserId, registeredUserId});
    });

    it('기록 있는 게스트가 가입된 계정으로 로그인하면 거절한다', () => {
      const decision = decideGoogleLogin({...guestFacts, guestHasRecords: true, registeredUserId});

      expect(decision).toEqual({type: 'reject'});
    });

    it('기록 있는 게스트가 기록 삭제를 고른 뒤 같은 계정으로 로그인하면 게스트를 지우고 그 계정으로 들어간다', () => {
      const decision = decideGoogleLogin({
        ...guestFacts,
        guestHasRecords: true,
        registeredUserId,
        discardIntentValid: true,
      });

      expect(decision).toEqual({type: 'switch-discard-guest', guestUserId, registeredUserId});
    });
  });

  describe('Edge cases', () => {
    it('기록 삭제를 고른 뒤 처음 쓰는 계정으로 로그인하면 지우지 않고 잇는다', () => {
      const decision = decideGoogleLogin({...guestFacts, guestHasRecords: true, discardIntentValid: true});

      expect(decision).toEqual({type: 'link', guestUserId});
    });

    it('기록 없는 게스트는 기록 삭제를 골랐어도 빈 게스트를 지우고 가입된 계정으로 들어간다', () => {
      const decision = decideGoogleLogin({...guestFacts, registeredUserId, discardIntentValid: true});

      expect(decision).toEqual({type: 'switch-delete-empty-guest', guestUserId, registeredUserId});
    });

    it('이미 그 구글 계정으로 이어진 게스트 세션으로 다시 로그인하면 그 계정으로 들어간다', () => {
      const decision = decideGoogleLogin({...guestFacts, guestHasRecords: true, registeredUserId: guestUserId});

      expect(decision).toEqual({type: 'find-or-create'});
    });
  });
});

describe('resolveGoogleLogin()', () => {
  const googleSub = 'sub-a';
  const recordDate = '2026-10-01';
  let db: PGlite;
  let runInTestTransaction: RunInTransaction;

  beforeEach(async () => {
    db = await createTestDb();
    runInTestTransaction = (work) => db.transaction((transaction) => work(transaction));
  });

  describe('General cases', () => {
    it('게스트 세션 없이 처음 로그인하면 새 사용자를 만들고 그 ID를 돌려준다', async () => {
      const userId = await resolveGoogleLogin(
        {googleSub, guestUserId: null, discardIntentValid: false},
        runInTestTransaction,
      );

      expect(await findUser(db, userId)).toEqual({isGuest: false, googleSub});
    });

    it('기록 있는 게스트가 처음 쓰는 구글 계정으로 로그인하면 같은 사용자 ID 그대로 계정이 이어지고 기록이 남는다', async () => {
      const guestUserId = await createGuestUserId(db);
      await insertStudyRecord(db, guestUserId, recordDate);

      const userId = await resolveGoogleLogin(
        {googleSub, guestUserId, discardIntentValid: false},
        runInTestTransaction,
      );

      expect(userId).toBe(guestUserId);
      expect(await findUser(db, guestUserId)).toEqual({isGuest: false, googleSub});
      expect(await countStudyRecords(db, guestUserId)).toBe(1);
    });

    it('기록 없는 게스트가 가입된 계정으로 로그인하면 그 계정의 사용자 ID를 돌려주고 게스트는 지워진다', async () => {
      const registeredUserId = await findOrCreateUserId(googleSub, db);
      const guestUserId = await createGuestUserId(db);

      const userId = await resolveGoogleLogin(
        {googleSub, guestUserId, discardIntentValid: false},
        runInTestTransaction,
      );

      expect(userId).toBe(registeredUserId);
      expect(await findUser(db, guestUserId)).toBeUndefined();
    });

    it('기록 삭제를 고르고 가입된 계정으로 로그인하면 게스트와 그 기록이 지워지고 가입된 계정의 기록은 그대로다', async () => {
      const registeredUserId = await findOrCreateUserId(googleSub, db);
      await insertStudyRecord(db, registeredUserId, recordDate);
      const guestUserId = await createGuestUserId(db);
      await insertStudyRecord(db, guestUserId, recordDate);

      const userId = await resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

      expect(userId).toBe(registeredUserId);
      expect(await findUser(db, guestUserId)).toBeUndefined();
      expect(await countStudyRecords(db, guestUserId)).toBe(0);
      expect(await countStudyRecords(db, registeredUserId)).toBe(1);
    });
  });

  describe('Edge cases', () => {
    it('이미 구글 계정에 이어진 게스트 세션으로 다시 로그인하면 같은 사용자로 들어가고 기록은 그대로다', async () => {
      const guestUserId = await createGuestUserId(db);
      await insertStudyRecord(db, guestUserId, recordDate);
      const params = {googleSub, guestUserId, discardIntentValid: true};
      await resolveGoogleLogin(params, runInTestTransaction);

      const userId = await resolveGoogleLogin(params, runInTestTransaction);

      expect(userId).toBe(guestUserId);
      expect(await findUser(db, guestUserId)).toEqual({isGuest: false, googleSub});
      expect(await countStudyRecords(db, guestUserId)).toBe(1);
    });

    it('기록 있는 게스트가 기록 삭제 없이 가입된 계정으로 오면 아무것도 바꾸지 않고 실패한다', async () => {
      await findOrCreateUserId(googleSub, db);
      const guestUserId = await createGuestUserId(db);
      await insertStudyRecord(db, guestUserId, recordDate);

      await expect(
        resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction),
      ).rejects.toThrow('기록 있는 게스트가 기록 삭제 없이 가입된 구글 계정으로 로그인하려 했다');
      expect(await findUser(db, guestUserId)).toEqual({isGuest: true, googleSub: null});
      expect(await countStudyRecords(db, guestUserId)).toBe(1);
    });
  });
});
