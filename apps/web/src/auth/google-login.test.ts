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
    it('게스트 세션이 없으면 구글 계정으로 사용자를 찾거나 만들라는 판정을 반환해야 한다', () => {
      const decision = decideGoogleLogin({...guestFacts, guestUserId: null});

      expect(decision).toEqual({type: 'find-or-create'});
    });

    describe('처음 쓰는 구글 계정으로 로그인할 때', () => {
      [
        {condition: '기록 있는', guestHasRecords: true},
        {condition: '기록 없는', guestHasRecords: false},
      ].forEach(({condition, guestHasRecords}) => {
        it(`${condition} 게스트면 게스트를 그 계정에 잇는 판정을 반환해야 한다`, () => {
          const decision = decideGoogleLogin({...guestFacts, guestHasRecords});

          expect(decision).toEqual({type: 'link', guestUserId});
        });
      });
    });

    describe('기록 없는 게스트가 가입된 계정으로 로그인할 때', () => {
      it('빈 게스트를 정리한 뒤 가입된 계정으로 전환하는 판정을 반환해야 한다', () => {
        const decision = decideGoogleLogin({...guestFacts, registeredUserId});

        expect(decision).toEqual({type: 'switch-delete-empty-guest', guestUserId, registeredUserId});
      });
    });

    describe('기록 있는 게스트가 가입된 계정으로 로그인할 때', () => {
      describe('기록 삭제를 골랐으면', () => {
        it('게스트를 삭제하고 가입된 계정으로 전환하는 판정을 반환해야 한다', () => {
          const decision = decideGoogleLogin({
            ...guestFacts,
            guestHasRecords: true,
            registeredUserId,
            discardIntentValid: true,
          });

          expect(decision).toEqual({type: 'switch-discard-guest', guestUserId, registeredUserId});
        });
      });
    });
  });

  describe('Edge cases', () => {
    describe('기록 있는 게스트가 가입된 계정으로 로그인할 때', () => {
      describe('기록 삭제를 고르지 않았으면', () => {
        it('거절 판정을 반환해야 한다', () => {
          const decision = decideGoogleLogin({...guestFacts, guestHasRecords: true, registeredUserId});

          expect(decision).toEqual({type: 'reject'});
        });
      });
    });

    describe('기록 있는 게스트가 처음 쓰는 구글 계정으로 로그인할 때', () => {
      describe('기록 삭제를 골랐으면', () => {
        it('게스트를 잇는 판정을 반환해야 한다', () => {
          const decision = decideGoogleLogin({...guestFacts, guestHasRecords: true, discardIntentValid: true});

          expect(decision).toEqual({type: 'link', guestUserId});
        });
      });
    });

    describe('기록 없는 게스트가 가입된 계정으로 로그인할 때', () => {
      describe('기록 삭제를 골랐으면', () => {
        it('빈 게스트를 정리한 뒤 가입된 계정으로 전환하는 판정을 반환해야 한다', () => {
          const decision = decideGoogleLogin({...guestFacts, registeredUserId, discardIntentValid: true});

          expect(decision).toEqual({type: 'switch-delete-empty-guest', guestUserId, registeredUserId});
        });
      });
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
    describe('게스트 세션 없이 처음 로그인하면', () => {
      it('새 사용자를 구글 계정의 사용자로 만들어야 한다', async () => {
        const userId = await resolveGoogleLogin(
          {googleSub, guestUserId: null, discardIntentValid: false},
          runInTestTransaction,
        );

        expect(await findUser(db, userId)).toEqual({isGuest: false, googleSub});
      });
    });

    describe('기록 있는 게스트가 처음 쓰는 구글 계정으로 로그인하면', () => {
      it('그 게스트의 사용자 ID를 반환해야 한다', async () => {
        const guestUserId = await createGuestUserId(db);
        await insertStudyRecord(db, guestUserId, recordDate);

        const userId = await resolveGoogleLogin(
          {googleSub, guestUserId, discardIntentValid: false},
          runInTestTransaction,
        );

        expect(userId).toBe(guestUserId);
      });

      it('그 게스트가 구글 계정의 사용자가 되어야 한다', async () => {
        const guestUserId = await createGuestUserId(db);
        await insertStudyRecord(db, guestUserId, recordDate);

        await resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction);

        expect(await findUser(db, guestUserId)).toEqual({isGuest: false, googleSub});
      });

      it('게스트의 기록을 그대로 둬야 한다', async () => {
        const guestUserId = await createGuestUserId(db);
        await insertStudyRecord(db, guestUserId, recordDate);

        await resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction);

        expect(await countStudyRecords(db, guestUserId)).toBe(1);
      });
    });

    describe('기록 없는 게스트가 가입된 계정으로 로그인하면', () => {
      it('가입된 계정의 사용자 ID를 반환해야 한다', async () => {
        const registeredUserId = await findOrCreateUserId(googleSub, db);
        const guestUserId = await createGuestUserId(db);

        const userId = await resolveGoogleLogin(
          {googleSub, guestUserId, discardIntentValid: false},
          runInTestTransaction,
        );

        expect(userId).toBe(registeredUserId);
      });

      it('빈 게스트를 지워야 한다', async () => {
        await findOrCreateUserId(googleSub, db);
        const guestUserId = await createGuestUserId(db);

        await resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction);

        expect(await findUser(db, guestUserId)).toBeUndefined();
      });
    });

    describe('기록 있는 게스트가 가입된 계정으로 로그인할 때', () => {
      describe('기록 삭제를 골랐으면', () => {
        it('가입된 계정의 사용자 ID를 반환해야 한다', async () => {
          const registeredUserId = await findOrCreateUserId(googleSub, db);
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          const userId = await resolveGoogleLogin(
            {googleSub, guestUserId, discardIntentValid: true},
            runInTestTransaction,
          );

          expect(userId).toBe(registeredUserId);
        });

        it('게스트를 지워야 한다', async () => {
          await findOrCreateUserId(googleSub, db);
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

          expect(await findUser(db, guestUserId)).toBeUndefined();
        });

        it('게스트의 기록을 지워야 한다', async () => {
          await findOrCreateUserId(googleSub, db);
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

          expect(await countStudyRecords(db, guestUserId)).toBe(0);
        });

        it('가입된 계정의 기록은 그대로 둬야 한다', async () => {
          const registeredUserId = await findOrCreateUserId(googleSub, db);
          await insertStudyRecord(db, registeredUserId, recordDate);
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

          expect(await countStudyRecords(db, registeredUserId)).toBe(1);
        });
      });
    });
  });

  describe('Edge cases', () => {
    describe('이미 구글 계정에 이어진 게스트 세션으로 다시 로그인하면', () => {
      it('같은 사용자 ID를 반환해야 한다', async () => {
        const guestUserId = await createGuestUserId(db);
        await insertStudyRecord(db, guestUserId, recordDate);
        const params = {googleSub, guestUserId, discardIntentValid: true};
        await resolveGoogleLogin(params, runInTestTransaction);

        expect(await resolveGoogleLogin(params, runInTestTransaction)).toBe(guestUserId);
      });

      it('기록을 그대로 둬야 한다', async () => {
        const guestUserId = await createGuestUserId(db);
        await insertStudyRecord(db, guestUserId, recordDate);
        const params = {googleSub, guestUserId, discardIntentValid: true};
        await resolveGoogleLogin(params, runInTestTransaction);

        await resolveGoogleLogin(params, runInTestTransaction);

        expect(await countStudyRecords(db, guestUserId)).toBe(1);
      });
    });

    describe('기록 있는 게스트가 가입된 계정으로 로그인할 때', () => {
      describe('기록 삭제를 고르지 않았으면', () => {
        it('에러를 던져야 한다', async () => {
          await findOrCreateUserId(googleSub, db);
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await expect(
            resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction),
          ).rejects.toThrow('기록 있는 게스트가 기록 삭제 없이 가입된 구글 계정으로 로그인하려 했다');
        });

        it('게스트를 그대로 둬야 한다', async () => {
          await findOrCreateUserId(googleSub, db);
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await expect(
            resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction),
          ).rejects.toThrow();

          expect(await findUser(db, guestUserId)).toEqual({isGuest: true, googleSub: null});
        });

        it('게스트의 기록을 그대로 둬야 한다', async () => {
          await findOrCreateUserId(googleSub, db);
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, recordDate);

          await expect(
            resolveGoogleLogin({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction),
          ).rejects.toThrow();

          expect(await countStudyRecords(db, guestUserId)).toBe(1);
        });
      });
    });
  });
});
