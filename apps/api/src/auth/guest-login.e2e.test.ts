import {HttpStatus, type INestApplication} from '@nestjs/common';
import type {PostAppTokenGuestApiResponse} from '@plan-for-myself/shared/auth';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {bearer, readAppTokenClaims, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {findUser} from '../testing/users';

describe('게스트 발급 API', () => {
  let connection: DatabaseConnection;

  /* 한도가 앱 메모리에 쌓이므로 테스트마다 앱을 새로 띄운다 */
  beforeEach(async () => {
    connection = await createInMemoryConnection();
    app = await startApp(connection);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('부르면 게스트 토큰을 반환해야 한다', async () => {
      const response = await startAsGuest();

      expect(await readGuestClaims(response.body)).toMatchObject({isGuest: true});
    });

    it('부르면 토큰의 사용자 번호로 게스트 행을 만들어야 한다', async () => {
      const response = await startAsGuest();

      const {sub} = await readGuestClaims(response.body);
      expect(await findUser(connection.db, Number(sub))).toEqual({isGuest: true, googleSub: null});
    });

    it('발급한 토큰으로 인증이 필요한 API를 부르면 200을 반환해야 한다', async () => {
      const response = await startAsGuest();

      await request(app.getHttpServer())
        .get('/api/study-records?month=2026-10')
        .set('Authorization', bearer((response.body as PostAppTokenGuestApiResponse).token))
        .expect(HttpStatus.OK);
    });
  });

  describe('Boundary cases', () => {
    describe('같은 IP에서 10분 안에 부를 때', () => {
      it('100번째면 200을 반환해야 한다', async () => {
        await startAsGuestTimes(GUEST_LIMIT - 1, CLIENT_IP);

        const response = await startAsGuest(CLIENT_IP);

        expect(response.status).toBe(HttpStatus.OK);
      });

      it('101번째면 웹과 같은 429 guest_limit을 반환해야 한다', async () => {
        await startAsGuestTimes(GUEST_LIMIT, CLIENT_IP);

        const response = await startAsGuest(CLIENT_IP);

        expect({status: response.status, body: response.body as unknown}).toEqual({
          status: HttpStatus.TOO_MANY_REQUESTS,
          body: {code: 'guest_limit', message: '게스트가 너무 많이 만들어져 잠시 막았어요'},
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('한도에 걸려도 웹처럼 한도 헤더를 싣지 않아야 한다', async () => {
      await startAsGuestTimes(GUEST_LIMIT, CLIENT_IP);

      const response = await startAsGuest(CLIENT_IP);

      expect(Object.keys(response.headers).filter((name) => /rate|retry/i.test(name))).toEqual([]);
    });

    it('한 IP가 한도를 넘어도 Railway가 전한 다른 IP는 200을 반환해야 한다', async () => {
      await startAsGuestTimes(GUEST_LIMIT, CLIENT_IP);

      const response = await startAsGuest(OTHER_CLIENT_IP);

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('한도를 넘은 IP가 X-Forwarded-For를 바꿔 보내도 429를 반환해야 한다', async () => {
      await startAsGuestTimes(GUEST_LIMIT, CLIENT_IP);

      const response = await startAsGuest(CLIENT_IP).set('X-Forwarded-For', OTHER_CLIENT_IP);

      expect(response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });

    it('같은 IPv6 /64 안에서 주소를 바꿔 가며 101번째로 부르면 429를 반환해야 한다', async () => {
      for (let count = 1; count <= GUEST_LIMIT; count += 1) {
        await startAsGuest(`2001:db8:1:1::${count}`).expect(HttpStatus.OK);
      }

      const response = await startAsGuest('2001:db8:1:1::ffff');

      expect(response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });

    it('X-Real-IP 없이 101번째로 부르면 429를 반환해야 한다', async () => {
      await startAsGuestTimes(GUEST_LIMIT);

      const response = await startAsGuest();

      expect(response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });

    it('게스트 한도에 걸린 IP도 Google idToken 교환은 한도에 걸리지 않아야 한다', async () => {
      await startAsGuestTimes(GUEST_LIMIT, CLIENT_IP);

      const response = await request(app.getHttpServer())
        .post('/api/app-token')
        .set('X-Real-IP', CLIENT_IP)
        .send({idToken: 'not-a-jwt', discardIntent: null});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('만료된 앱 토큰을 함께 보내도 게스트 토큰을 반환해야 한다', async () => {
      const expired = await signTestToken('1', {expirationTime: '1h ago'});

      const response = await startAsGuest().set('Authorization', bearer(expired));

      expect(await readGuestClaims(response.body)).toMatchObject({isGuest: true});
    });
  });
});

const GUEST_PATH = '/api/app-token/guest';
const GUEST_LIMIT = 100;
const CLIENT_IP = '203.0.113.1';
const OTHER_CLIENT_IP = '203.0.113.2';

let app: INestApplication<App>;

function startAsGuest(clientIp?: string) {
  const call = request(app.getHttpServer()).post(GUEST_PATH);
  if (clientIp !== undefined) {
    call.set('X-Real-IP', clientIp);
  }
  return call;
}

async function startAsGuestTimes(times: number, clientIp?: string) {
  for (let count = 0; count < times; count += 1) {
    await startAsGuest(clientIp).expect(HttpStatus.OK);
  }
}

function readGuestClaims(body: unknown) {
  return readAppTokenClaims((body as PostAppTokenGuestApiResponse).token);
}
