import {HttpStatus, type INestApplication} from '@nestjs/common';
import type {PostAppTokenRefreshApiResponse} from '@plan-for-myself/shared/auth';
import {sql} from 'drizzle-orm';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {bearer, readAppTokenClaims, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {insertGoogleUser, insertGuest} from '../testing/users';

describe('앱 토큰 갱신 API', () => {
  let connection: DatabaseConnection;

  beforeAll(async () => {
    connection = await createInMemoryConnection();
    app = await startApp(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('게스트 토큰이면 같은 사용자 번호의 게스트 토큰을 반환해야 한다', async () => {
      const guestId = await insertGuest(connection.db);

      const response = await refresh(await signTestToken(String(guestId), {isGuest: true}));

      expect(await readRefreshedClaims(response.body)).toMatchObject({sub: String(guestId), isGuest: true});
    });

    it('Google 사용자 토큰이면 같은 사용자 번호의 토큰을 반환해야 한다', async () => {
      const userId = await insertGoogleUser(connection.db, 'refresh-sub');

      const response = await refresh(await signTestToken(String(userId)));

      expect(await readRefreshedClaims(response.body)).toMatchObject({sub: String(userId)});
    });

    it('Google 사용자 토큰이면 isGuest 없는 토큰을 반환해야 한다', async () => {
      const userId = await insertGoogleUser(connection.db, 'refresh-no-guest-sub');

      const response = await refresh(await signTestToken(String(userId)));

      expect(await readRefreshedClaims(response.body)).not.toHaveProperty('isGuest');
    });

    it('갱신하면 만료를 발급 시각에서 30일 뒤로 잡아야 한다', async () => {
      const guestId = await insertGuest(connection.db);

      const response = await refresh(await signTestToken(String(guestId)));

      const {iat = 0, exp = 0} = await readRefreshedClaims(response.body);
      expect(exp - iat).toBe(THIRTY_DAYS_SECONDS);
    });
  });

  describe('Edge cases', () => {
    it('게스트였다가 Google에 연결된 사용자가 옛 게스트 토큰으로 오면 isGuest 없는 토큰을 반환해야 한다', async () => {
      const userId = await insertGuest(connection.db);
      const oldGuestToken = await signTestToken(String(userId), {isGuest: true});
      await connection.db.execute(
        sql`UPDATE users SET google_sub = 'linked-sub', is_guest = false WHERE id = ${userId}`,
      );

      const response = await refresh(oldGuestToken);

      expect(await readRefreshedClaims(response.body)).not.toHaveProperty('isGuest');
    });

    it('만료된 지 1초 지난 토큰이면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const guestId = await insertGuest(connection.db);

      const response = await refresh(await signTestToken(String(guestId), {expirationTime: '1s ago'}));

      expect({status: response.status, code: (response.body as {code: string}).code}).toEqual({
        status: HttpStatus.UNAUTHORIZED,
        code: 'UNAUTHORIZED',
      });
    });

    it('탈퇴한 사용자의 토큰이면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const guestId = await insertGuest(connection.db);
      const token = await signTestToken(String(guestId));
      await connection.db.execute(sql`DELETE FROM users WHERE id = ${guestId}`);

      const response = await refresh(token);

      expect({status: response.status, code: (response.body as {code: string}).code}).toEqual({
        status: HttpStatus.UNAUTHORIZED,
        code: 'UNAUTHORIZED',
      });
    });

    it('토큰 없이 부르면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).post(REFRESH_PATH);

      expect({status: response.status, code: (response.body as {code: string}).code}).toEqual({
        status: HttpStatus.UNAUTHORIZED,
        code: 'UNAUTHORIZED',
      });
    });
  });
});

const REFRESH_PATH = '/api/app-token/refresh';
const SECONDS_PER_DAY = 86_400;
const TOKEN_TTL_DAYS = 30;
const THIRTY_DAYS_SECONDS = TOKEN_TTL_DAYS * SECONDS_PER_DAY;

let app: INestApplication<App>;

function refresh(token: string) {
  return request(app.getHttpServer()).post(REFRESH_PATH).set('Authorization', bearer(token));
}

function readRefreshedClaims(body: unknown) {
  return readAppTokenClaims((body as PostAppTokenRefreshApiResponse).token);
}
