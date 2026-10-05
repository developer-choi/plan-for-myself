// @vitest-environment node
import type {PGlite} from '@electric-sql/pglite';
import {CredentialsSignin} from 'next-auth';
import {beforeEach, describe, expect, it} from 'vitest';
import {countGuests, createTestDb} from '@/server/db/test-db';
import {GuestLimitError} from '@/server/user/repository';
import {authorizeGuest} from './guest-login';

const LOGIN_URL = 'http://localhost/api/auth/callback/guest';
const limit = 30;

function createRequest(ip?: string) {
  return new Request(LOGIN_URL, {method: 'POST', headers: ip ? {'x-forwarded-for': ip} : {}});
}

async function loginUpToLimit(db: PGlite, ip?: string) {
  for (let index = 0; index < limit; index++) {
    await authorizeGuest(createRequest(ip), db);
  }
}

async function expectGuestLimitError(login: Promise<unknown>) {
  const error = await login.catch((caught: unknown) => caught);

  expect(error).toBeInstanceOf(CredentialsSignin);
  expect(error).toMatchObject({code: 'guest_limit'});
  expect(error).toHaveProperty('cause.err', expect.any(GuestLimitError));
}

describe('authorizeGuest()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = await createTestDb();
  });

  describe('General cases', () => {
    it('한도 안의 로그인은 게스트 id를 돌려줘야 한다', async () => {
      const {id} = await authorizeGuest(createRequest('203.0.113.1'), db);

      expect(id).toEqual(expect.any(String));
      expect(await countGuests(db)).toBe(1);
    });
  });

  describe('Boundary cases', () => {
    it('같은 IP의 31번째 로그인은 guest_limit 코드로 실패해야 한다', async () => {
      const ip = '203.0.113.1';
      await loginUpToLimit(db, ip);

      await expectGuestLimitError(authorizeGuest(createRequest(ip), db));
      expect(await countGuests(db)).toBe(limit);
    });
  });

  describe('Edge cases', () => {
    it('IP 헤더 없는 요청이 30번 쌓이면 다음 요청은 guest_limit으로 실패해야 한다', async () => {
      await loginUpToLimit(db);

      await expectGuestLimitError(authorizeGuest(createRequest(), db));
    });

    it('IP 헤더 없는 요청이 한도에 닿아도 IP가 있는 요청은 게스트로 로그인돼야 한다', async () => {
      await loginUpToLimit(db);

      const {id} = await authorizeGuest(createRequest('203.0.113.2'), db);
      expect(id).toEqual(expect.any(String));
    });
  });
});
