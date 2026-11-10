// @vitest-environment node
import type {PGlite} from '@electric-sql/pglite';
import type {PostAppTokenApiResponse} from '@plan-for-myself/shared';
import {beforeEach, describe, expect, it} from 'vitest';
import {issueAppTokenExchange, issueAppTokenForNewGuest} from '@/auth/app-login';
import {readAuthorizationUserId} from '@/auth/app-token';
import type {RunInTransaction} from '@/auth/google-login';
import {createRegisteredRejection} from '@/auth/login-cookies';
import {countGuests, countStudyRecords, createTestDb, findUser, insertStudyRecord} from '@/server/db/test-db';
import {createGuestUserId, deleteGuestUser, findOrCreateUserId, linkGuestToGoogle} from '@/server/user/repository';

describe('issueAppTokenForNewGuest()', () => {
  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('한도에 걸리지 않으면 새로 만든 게스트 하나의 ID로 풀리는 토큰을 반환해야 한다', async () => {
      const token = await issueAppTokenForNewGuest(GUEST_REQUEST, db, () => Promise.resolve(false));

      const userId = await readAuthorizationUserId(`Bearer ${token ?? ''}`);
      expect(await findUser(db, userId ?? '')).toEqual({isGuest: true, googleSub: null});
      expect(await countGuests(db)).toBe(1);
    });

    it('한도에 걸리면 null을 반환해야 한다', async () => {
      expect(await issueAppTokenForNewGuest(GUEST_REQUEST, db, () => Promise.resolve(true))).toBeNull();
    });

    it('한도에 걸리면 게스트를 만들지 않아야 한다', async () => {
      await issueAppTokenForNewGuest(GUEST_REQUEST, db, () => Promise.resolve(true));

      expect(await countGuests(db)).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('한도 거절이 아닌 오류면 그 에러를 던져야 한다', async () => {
      const error = new Error('판정 실패');

      await expect(issueAppTokenForNewGuest(GUEST_REQUEST, db, () => Promise.reject(error))).rejects.toBe(error);
    });
  });
});

describe('issueAppTokenExchange()', () => {
  beforeEach(async () => {
    db = await createTestDb();
    runInTestTransaction = (work) => db.transaction((transaction) => work(transaction));
  });

  describe('General cases', () => {
    it('처음 보는 구글 계정이면 게스트가 아닌 사용자를 그 계정으로 만들어야 한다', async () => {
      const googleSub = 'google-sub-new';

      const userId = await exchangeWithoutGuest(googleSub);

      expect(await findUser(db, userId)).toEqual({isGuest: false, googleSub});
    });

    it('웹에서 가입한 구글 계정이면 웹과 같은 사용자 ID로 풀리는 토큰을 반환해야 한다', async () => {
      const googleSub = 'google-sub-1';
      const registeredUserId = await findOrCreateUserId(googleSub, db);

      expect(await exchangeWithoutGuest(googleSub)).toBe(registeredUserId);
    });

    it('웹에서 가입한 구글 계정이면 사용자를 새로 만들지 않아야 한다', async () => {
      const googleSub = 'google-sub-1';
      await findOrCreateUserId(googleSub, db);

      await exchangeWithoutGuest(googleSub);

      expect(await countUsers()).toBe(1);
    });

    describe('게스트가 처음 쓰는 구글 계정으로 오면', () => {
      it('그 게스트의 사용자 ID로 풀리는 토큰을 반환해야 한다', async () => {
        const googleSub = 'google-sub-new';
        const guestUserId = await createGuestUserId(db);

        const exchange = await issueAppTokenExchange(
          {googleSub, guestUserId, discardIntentValid: false},
          runInTestTransaction,
        );

        expect(await readSessionUserId(exchange)).toBe(guestUserId);
      });

      it('그 게스트가 구글 계정의 사용자가 되어야 한다', async () => {
        const googleSub = 'google-sub-new';
        const guestUserId = await createGuestUserId(db);

        await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction);

        expect(await findUser(db, guestUserId)).toEqual({isGuest: false, googleSub});
      });
    });

    describe('기록 있는 게스트가 가입된 계정으로 올 때', () => {
      describe('게스트 계정 삭제를 골랐으면', () => {
        it('가입된 계정의 토큰을 반환해야 한다', async () => {
          const googleSub = 'google-sub-1';
          const {guestUserId, registeredUserId} = await createGuestWithRecordAndRegisteredAccount(googleSub);

          const exchange = await issueAppTokenExchange(
            {googleSub, guestUserId, discardIntentValid: true},
            runInTestTransaction,
          );

          expect(await readSessionUserId(exchange)).toBe(registeredUserId);
        });

        it('게스트를 지워야 한다', async () => {
          const googleSub = 'google-sub-1';
          const {guestUserId} = await createGuestWithRecordAndRegisteredAccount(googleSub);

          await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

          expect(await findUser(db, guestUserId)).toBeUndefined();
        });

        it('게스트의 기록을 지워야 한다', async () => {
          const googleSub = 'google-sub-1';
          const {guestUserId} = await createGuestWithRecordAndRegisteredAccount(googleSub);

          await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

          expect(await countStudyRecords(db, guestUserId)).toBe(0);
        });

        it('가입된 계정의 기록은 그대로 둬야 한다', async () => {
          const googleSub = 'google-sub-1';
          const {guestUserId, registeredUserId} = await createGuestWithRecordAndRegisteredAccount(googleSub);
          await insertStudyRecord(db, registeredUserId, RECORD_DATE);

          await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

          expect(await countStudyRecords(db, registeredUserId)).toBe(1);
        });
      });
    });
  });

  describe('Boundary cases', () => {
    describe('기록 없는 게스트가 가입된 계정으로 오면', () => {
      it('가입된 계정의 토큰을 반환해야 한다', async () => {
        const googleSub = 'google-sub-1';
        const registeredUserId = await findOrCreateUserId(googleSub, db);
        const guestUserId = await createGuestUserId(db);

        const exchange = await issueAppTokenExchange(
          {googleSub, guestUserId, discardIntentValid: false},
          runInTestTransaction,
        );

        expect(await readSessionUserId(exchange)).toBe(registeredUserId);
      });

      it('빈 게스트를 지워야 한다', async () => {
        const googleSub = 'google-sub-1';
        await findOrCreateUserId(googleSub, db);
        const guestUserId = await createGuestUserId(db);

        await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction);

        expect(await findUser(db, guestUserId)).toBeUndefined();
      });
    });
  });

  describe('Edge cases', () => {
    describe('기록 있는 게스트가 가입된 계정으로 올 때', () => {
      describe('게스트 계정 삭제를 고르지 않았으면', () => {
        it('세션 토큰 대신 그 게스트의 연결 거절을 반환해야 한다', async () => {
          const googleSub = 'google-sub-1';
          const {guestUserId} = await createGuestWithRecordAndRegisteredAccount(googleSub);

          const exchange = await issueAppTokenExchange(
            {googleSub, guestUserId, discardIntentValid: false},
            runInTestTransaction,
          );

          expect(exchange).toEqual({
            type: 'registered-account',
            rejection: createRegisteredRejection(guestUserId, googleSub),
          });
        });

        it('게스트를 그대로 둬야 한다', async () => {
          const googleSub = 'google-sub-1';
          const {guestUserId} = await createGuestWithRecordAndRegisteredAccount(googleSub);

          await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction);

          expect(await findUser(db, guestUserId)).toEqual({isGuest: true, googleSub: null});
        });

        it('게스트의 기록을 그대로 둬야 한다', async () => {
          const googleSub = 'google-sub-1';
          const {guestUserId} = await createGuestWithRecordAndRegisteredAccount(googleSub);

          await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: false}, runInTestTransaction);

          expect(await countStudyRecords(db, guestUserId)).toBe(1);
        });
      });
    });

    describe('지워진 게스트의 토큰으로 오면', () => {
      it('가입된 계정이면 그 계정의 토큰을 반환해야 한다', async () => {
        const googleSub = 'google-sub-1';
        const registeredUserId = await findOrCreateUserId(googleSub, db);
        const guestUserId = await createDeletedGuestUserId();

        const exchange = await issueAppTokenExchange(
          {googleSub, guestUserId, discardIntentValid: false},
          runInTestTransaction,
        );

        expect(await readSessionUserId(exchange)).toBe(registeredUserId);
      });

      it('처음 쓰는 구글 계정이면 그 계정의 새 사용자 토큰을 반환해야 한다', async () => {
        const googleSub = 'google-sub-new';
        const guestUserId = await createDeletedGuestUserId();

        const exchange = await issueAppTokenExchange(
          {googleSub, guestUserId, discardIntentValid: false},
          runInTestTransaction,
        );

        expect(await findUser(db, await readSessionUserId(exchange))).toEqual({isGuest: false, googleSub});
      });
    });

    describe('구글 계정에 이어진 사용자의 낡은 게스트 토큰으로 올 때', () => {
      describe('다른 가입 계정이 오면', () => {
        it('그 계정의 토큰을 반환해야 한다', async () => {
          const googleSub = 'google-sub-1';
          const registeredUserId = await findOrCreateUserId(googleSub, db);
          const linkedUserId = await createLinkedUserIdWithRecord('google-sub-linked');

          const exchange = await issueAppTokenExchange(
            {googleSub, guestUserId: linkedUserId, discardIntentValid: true},
            runInTestTransaction,
          );

          expect(await readSessionUserId(exchange)).toBe(registeredUserId);
        });

        it('이어진 사용자의 기록을 그대로 둬야 한다', async () => {
          const googleSub = 'google-sub-1';
          await findOrCreateUserId(googleSub, db);
          const linkedUserId = await createLinkedUserIdWithRecord('google-sub-linked');

          await issueAppTokenExchange(
            {googleSub, guestUserId: linkedUserId, discardIntentValid: true},
            runInTestTransaction,
          );

          expect(await countStudyRecords(db, linkedUserId)).toBe(1);
        });
      });
    });

    describe('기록 있는 게스트가 처음 쓰는 구글 계정으로 올 때', () => {
      describe('게스트 계정 삭제를 골랐으면', () => {
        it('그 게스트를 구글 계정에 이어야 한다', async () => {
          const googleSub = 'google-sub-new';
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, RECORD_DATE);

          await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

          expect(await findUser(db, guestUserId)).toEqual({isGuest: false, googleSub});
        });

        it('게스트의 기록을 그대로 둬야 한다', async () => {
          const googleSub = 'google-sub-new';
          const guestUserId = await createGuestUserId(db);
          await insertStudyRecord(db, guestUserId, RECORD_DATE);

          await issueAppTokenExchange({googleSub, guestUserId, discardIntentValid: true}, runInTestTransaction);

          expect(await countStudyRecords(db, guestUserId)).toBe(1);
        });
      });
    });
  });
});

const GUEST_REQUEST = new Request('http://localhost/api/app-token/guest', {method: 'POST'});
const RECORD_DATE = '2026-10-01';

let db: PGlite;
let runInTestTransaction: RunInTransaction;

async function createGuestWithRecordAndRegisteredAccount(googleSub: string) {
  const registeredUserId = await findOrCreateUserId(googleSub, db);
  const guestUserId = await createGuestUserId(db);
  await insertStudyRecord(db, guestUserId, RECORD_DATE);
  return {guestUserId, registeredUserId};
}

async function createDeletedGuestUserId() {
  const guestUserId = await createGuestUserId(db);
  await deleteGuestUser(guestUserId, {withRecords: false}, db);
  return guestUserId;
}

async function createLinkedUserIdWithRecord(googleSub: string) {
  const userId = await createGuestUserId(db);
  await insertStudyRecord(db, userId, RECORD_DATE);
  await linkGuestToGoogle(userId, googleSub, db);
  return userId;
}

async function exchangeWithoutGuest(googleSub: string) {
  const exchange = await issueAppTokenExchange(
    {googleSub, guestUserId: null, discardIntentValid: false},
    runInTestTransaction,
  );
  return readSessionUserId(exchange);
}

async function readSessionUserId(exchange: PostAppTokenApiResponse) {
  if (exchange.type !== 'session') {
    throw new Error('세션 토큰을 받지 못했다');
  }

  const userId = await readAuthorizationUserId(`Bearer ${exchange.token}`);
  if (userId === null) {
    throw new Error('발급한 앱용 토큰을 풀지 못했다');
  }
  return userId;
}

async function countUsers() {
  const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM users');
  return rows[0].count;
}
