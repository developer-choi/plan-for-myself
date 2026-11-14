import {AuthenticationRegistry, CurrentUser} from '@nestjs/authentication';
import {Controller, Get, HttpStatus, type INestApplication} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ImpossibleStateError} from '@plan-for-myself/shared/error';
import {eq, sql} from 'drizzle-orm';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {users} from '../db/schema';
import {bearer, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {UserRepository, type UserRow} from '../user/user.repository';
import {AppTokenProvider} from './app-token.provider';

describe('앱 토큰 인증', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    connection = await createInMemoryConnection();
    app = await startApp(connection, {controllers: [AuthProbeController]});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('살아 있는 사용자의 토큰이면 그 사용자 번호를 반환해야 한다', async () => {
      const userId = await insertGuest();
      const token = await signTestToken(String(userId));

      const response = await request(app.getHttpServer()).get(PROBE_PATH).set('Authorization', bearer(token));

      expect(response.body).toEqual({id: userId});
    });

    it('토큰 없이 헬스 체크를 부르면 200을 반환해야 한다', async () => {
      await request(app.getHttpServer()).get('/health').expect(HttpStatus.OK);
    });
  });

  describe('Boundary cases', () => {
    it('토큰의 사용자 번호가 9007199254740991보다 크면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const unsafeId = Number.MAX_SAFE_INTEGER + 1;
      await connection.db.execute(
        sql`INSERT INTO users (id, is_guest) OVERRIDING SYSTEM VALUE VALUES (${unsafeId}, true)`,
      );
      const token = await signTestToken(String(unsafeId));

      const response = await request(app.getHttpServer()).get(PROBE_PATH).set('Authorization', bearer(token));

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toMatchObject({code: 'UNAUTHORIZED'});
    });

    [
      {name: '토큰의 발급 시각이 서버 시계보다 5초 앞서면', options: {issuedAt: '5s from now'}},
      {name: '토큰이 만료된 지 10초면', options: {expirationTime: '10s ago'}},
    ].forEach(({name, options}) => {
      it(`${name} 200을 반환해야 한다`, async () => {
        const token = await signTestToken(String(await insertGuest()), options);

        await request(app.getHttpServer()).get(PROBE_PATH).set('Authorization', bearer(token)).expect(HttpStatus.OK);
      });
    });

    it('토큰이 만료된 지 31초면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const token = await signTestToken(String(await insertGuest()), {expirationTime: '31s ago'});

      const response = await request(app.getHttpServer()).get(PROBE_PATH).set('Authorization', bearer(token));

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toMatchObject({code: 'UNAUTHORIZED'});
    });

    it('AUTH_SECRET이 31바이트면 토큰 검증기를 만들 때 ImpossibleStateError를 던져야 한다', () => {
      expect(() => createProvider('thirty-one-bytes-test-secret-x!')).toThrow(ImpossibleStateError);
    });

    it('AUTH_SECRET이 한글로 채운 32바이트면 토큰 검증기를 만들어야 한다', () => {
      expect(() => createProvider('가나다라마바사아자차ab')).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('토큰이 없으면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get(PROBE_PATH);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toMatchObject({code: 'UNAUTHORIZED'});
    });

    it('토큰이 없으면 로그인 안내 문구를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get(PROBE_PATH);

      expect(response.body).toMatchObject({message: '로그인이 필요해요'});
    });

    it('토큰이 없으면 WWW-Authenticate 헤더에 Bearer 방식을 담아 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get(PROBE_PATH);

      expect(response.headers['www-authenticate']).toMatch(/^Bearer /);
    });

    [
      {name: 'Bearer가 아닌 방식(Basic)이면', authorization: 'Basic dXNlcjpwYXNz'},
      {name: 'Bearer만 있고 토큰이 비어 있으면', authorization: 'Bearer '},
    ].forEach(({name, authorization}) => {
      it(`Authorization 헤더가 ${name} 401 UNAUTHORIZED를 반환해야 한다`, async () => {
        const response = await request(app.getHttpServer()).get(PROBE_PATH).set('Authorization', authorization);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.body).toMatchObject({code: 'UNAUTHORIZED'});
      });
    });

    [
      {name: '토큰이 JWT 형식이 아니면', sign: () => Promise.resolve('not-a-jwt')},
      {
        name: '토큰의 서명 키가 서버와 다르면',
        sign: (id: number) => signTestToken(String(id), {secret: 'another-secret-only-to-break-the-signature'}),
      },
      {
        name: '토큰의 서명 알고리즘이 HS256이 아닌 HS384면',
        sign: (id: number) => signTestToken(String(id), {algorithm: 'HS384'}),
      },
      {
        name: '토큰의 서명 알고리즘이 HS256이 아닌 HS512면',
        sign: (id: number) => signTestToken(String(id), {algorithm: 'HS512'}),
      },
      {name: '토큰에 만료 시각이 없으면', sign: (id: number) => signTestToken(String(id), {withoutExpiration: true})},
      {name: '토큰의 발급 대상이 이 앱이 아니면', sign: (id: number) => signTestToken(String(id), {audience: 'other'})},
      {name: '토큰에 사용자 번호가 없으면', sign: () => signTestToken(undefined)},
      {name: '토큰의 사용자 번호가 지수 표기(1e0 꼴)면', sign: (id: number) => signTestToken(`${id}e0`)},
      {name: '토큰의 사용자 번호 앞에 0이 붙었으면', sign: (id: number) => signTestToken(`0${id}`)},
    ].forEach(({name, sign}) => {
      it(`${name} 401 UNAUTHORIZED를 반환해야 한다`, async () => {
        const token = await sign(await insertGuest());

        const response = await request(app.getHttpServer()).get(PROBE_PATH).set('Authorization', bearer(token));

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.body).toMatchObject({code: 'UNAUTHORIZED'});
      });
    });

    it('탈퇴한 사용자의 토큰이면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const userId = await insertGuest();
      const token = await signTestToken(String(userId));
      await connection.db.delete(users).where(eq(users.id, userId));

      const response = await request(app.getHttpServer()).get(PROBE_PATH).set('Authorization', bearer(token));

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toMatchObject({code: 'UNAUTHORIZED'});
    });

    it('Authorization 헤더의 Bearer를 소문자(bearer)로 써도 200을 반환해야 한다', async () => {
      const token = await signTestToken(String(await insertGuest()));

      await request(app.getHttpServer()).get(PROBE_PATH).set('Authorization', `bearer ${token}`).expect(HttpStatus.OK);
    });

    it('DB에 연결할 수 없으면 500 INTERNAL_ERROR를 반환해야 한다', async () => {
      const failingApp = await startApp(await createClosedConnection(), {controllers: [AuthProbeController]});
      try {
        const token = await signTestToken('1');

        const response = await request(failingApp.getHttpServer()).get(PROBE_PATH).set('Authorization', bearer(token));

        expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).toMatchObject({code: 'INTERNAL_ERROR'});
      } finally {
        await failingApp.close();
      }
    });

    it('AUTH_SECRET이 비어 있으면 토큰 검증기를 만들 때 ImpossibleStateError를 던져야 한다', () => {
      expect(() => createProvider('')).toThrow(ImpossibleStateError);
    });
  });
});

const PROBE_ROUTE = 'auth-probe';
const PROBE_PATH = `/api/${PROBE_ROUTE}`;

let connection: DatabaseConnection;

@Controller(PROBE_ROUTE)
class AuthProbeController {
  @Get()
  read(@CurrentUser() user: UserRow) {
    return user;
  }
}

async function createClosedConnection(): Promise<DatabaseConnection> {
  const closedConnection = await createInMemoryConnection();
  await closedConnection.close();
  return {db: closedConnection.db, close: () => Promise.resolve()};
}

function createProvider(secret: string) {
  return new AppTokenProvider(
    new ConfigService({AUTH_SECRET: secret}),
    new UserRepository(connection.db),
    new AuthenticationRegistry(),
  );
}

async function insertGuest() {
  const [row] = await connection.db.insert(users).values({isGuest: true}).returning({id: users.id});
  if (!row) {
    throw new Error('게스트 행을 만들지 못했다');
  }
  return row.id;
}
