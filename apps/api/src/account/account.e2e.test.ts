import {HttpStatus, type INestApplication} from '@nestjs/common';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {bearer, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {insertGuest} from '../testing/users';

describe('회원 탈퇴 API', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    connection = await createInMemoryConnection();
    app = await startApp(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('탈퇴하면 204를 반환해야 한다', async () => {
      const auth = await signIn();

      await request(app.getHttpServer()).delete(ACCOUNT_PATH).set('Authorization', auth).expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('Edge cases', () => {
    it('토큰 없이 부르면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).delete(ACCOUNT_PATH);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toMatchObject({code: 'UNAUTHORIZED'});
    });

    it('탈퇴한 뒤 같은 토큰으로 다시 부르면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const auth = await signIn();
      await request(app.getHttpServer()).delete(ACCOUNT_PATH).set('Authorization', auth);

      const response = await request(app.getHttpServer()).delete(ACCOUNT_PATH).set('Authorization', auth);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toMatchObject({code: 'UNAUTHORIZED'});
    });
  });
});

const ACCOUNT_PATH = '/api/account';

let connection: DatabaseConnection;

async function signIn() {
  const userId = await insertGuest(connection.db);
  return bearer(await signTestToken(String(userId)));
}
