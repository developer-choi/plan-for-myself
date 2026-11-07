// @vitest-environment node
import type {PGlite} from '@electric-sql/pglite';
import {beforeEach, describe, expect, it} from 'vitest';
import {issueAppTokenForGoogleSub} from '@/auth/app-login';
import {readAuthorizationUserId} from '@/auth/app-token';
import type {RunInTransaction} from '@/auth/google-login';
import {createTestDb, findUser} from '@/server/db/test-db';
import {findOrCreateUserId} from '@/server/user/repository';

describe('issueAppTokenForGoogleSub()', () => {
  beforeEach(async () => {
    db = await createTestDb();
    runInTestTransaction = (work) => db.transaction((transaction) => work(transaction));
  });

  describe('General cases', () => {
    it('처음 보는 구글 계정이면 게스트가 아닌 사용자를 그 계정으로 만들어야 한다', async () => {
      const googleSub = 'google-sub-new';

      const userId = await readIssuedUserId(googleSub);

      expect(await findUser(db, userId)).toEqual({isGuest: false, googleSub});
    });

    it('웹에서 가입한 구글 계정이면 웹과 같은 사용자 ID로 풀리는 토큰을 반환해야 한다', async () => {
      const googleSub = 'google-sub-1';
      const registeredUserId = await findOrCreateUserId(googleSub, db);

      expect(await readIssuedUserId(googleSub)).toBe(registeredUserId);
    });

    it('웹에서 가입한 구글 계정이면 사용자를 새로 만들지 않아야 한다', async () => {
      const googleSub = 'google-sub-1';
      await findOrCreateUserId(googleSub, db);

      await issueAppTokenForGoogleSub(googleSub, runInTestTransaction);

      expect(await countUsers()).toBe(1);
    });
  });
});

let db: PGlite;
let runInTestTransaction: RunInTransaction;

async function readIssuedUserId(googleSub: string) {
  const token = await issueAppTokenForGoogleSub(googleSub, runInTestTransaction);
  const userId = await readAuthorizationUserId(`Bearer ${token}`);
  if (userId === null) {
    throw new Error('발급한 앱용 토큰을 풀지 못했다');
  }
  return userId;
}

async function countUsers() {
  const {rows} = await db.query<{count: number}>('SELECT count(*)::int AS count FROM users');
  return rows[0].count;
}
