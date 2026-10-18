// @vitest-environment node
import type {PGlite} from '@electric-sql/pglite';
import {CredentialsSignin} from 'next-auth';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {countGuests, createTestDb} from '@/server/db/test-db';
import {authorizeGuest, isGuestCreationRateLimited, type RateLimitCheck} from './guest-login';

const LOGIN_URL = 'http://localhost/api/auth/callback/guest';

function createRequest() {
  return new Request(LOGIN_URL, {method: 'POST'});
}

const notRateLimited: RateLimitCheck = () => Promise.resolve(false);
const rateLimited: RateLimitCheck = () => Promise.resolve(true);

describe('authorizeGuest()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('한도에 걸리지 않은 로그인은 새로 만든 게스트 id를 반환해야 한다', async () => {
      const {id} = await authorizeGuest(createRequest(), db, notRateLimited);

      expect(id).toEqual(expect.any(String));
      expect(await countGuests(db)).toBe(1);
    });

    it('한도에 걸린 로그인은 guest_limit 코드로 실패해야 한다', async () => {
      const error = await authorizeGuest(createRequest(), db, rateLimited).catch((caught: unknown) => caught);

      expect(error).toBeInstanceOf(CredentialsSignin);
      expect(error).toMatchObject({code: 'guest_limit'});
    });

    it('한도에 걸린 로그인은 게스트를 만들지 않아야 한다', async () => {
      await authorizeGuest(createRequest(), db, rateLimited).catch((caught: unknown) => caught);

      expect(await countGuests(db)).toBe(0);
    });
  });
});

describe('isGuestCreationRateLimited()', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Edge cases', () => {
    it('게스트 생성 한도를 확인하지 못하면 false를 반환해야 한다', async () => {
      vi.stubEnv('NODE_ENV', 'production');

      expect(await isGuestCreationRateLimited(createRequest())).toBe(false);
    });
  });
});
