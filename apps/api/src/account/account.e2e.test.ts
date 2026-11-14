import {HttpStatus, type INestApplication} from '@nestjs/common';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {bearer, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {findDeletedAt, findUser, insertGoogleUser, insertGuest, insertRecordOnUserDelete} from '../testing/users';

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

    it('Google 계정이 탈퇴하면 탈퇴한 시각을 탈퇴 표시로 찍어야 한다', async () => {
      const userId = await insertGoogleUser(connection.db, 'withdraw-sub');
      const before = Date.now();

      await request(app.getHttpServer())
        .delete(ACCOUNT_PATH)
        .set('Authorization', await authOf(userId));

      const deletedAt = (await findDeletedAt(connection.db, userId))?.getTime();
      expect(deletedAt).toBeGreaterThanOrEqual(before);
      expect(deletedAt).toBeLessThanOrEqual(Date.now());
    });

    it('게스트가 탈퇴하면 사용자 행을 바로 지워야 한다', async () => {
      const userId = await insertGuest(connection.db);

      await request(app.getHttpServer())
        .delete(ACCOUNT_PATH)
        .set('Authorization', await authOf(userId));

      expect(await findUser(connection.db, userId)).toBeNull();
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

    it('게스트를 지우는 도중 그 게스트의 기록이 새로 들어오면 탈퇴 표시를 찍어야 한다', async () => {
      const raceConnection = await createInMemoryConnection();
      const raceApp = await startApp(raceConnection);
      try {
        const userId = await insertGuest(raceConnection.db);
        await insertRecordOnUserDelete(raceConnection.db);
        const before = Date.now();

        await request(raceApp.getHttpServer())
          .delete(ACCOUNT_PATH)
          .set('Authorization', await authOf(userId));

        const deletedAt = (await findDeletedAt(raceConnection.db, userId))?.getTime();
        expect(deletedAt).toBeGreaterThanOrEqual(before);
        expect(deletedAt).toBeLessThanOrEqual(Date.now());
      } finally {
        await raceApp.close();
      }
    });

    it('탈퇴 표시된 Google 계정의 토큰으로 부르면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const auth = await authOf(await insertGoogleUser(connection.db, 'withdrawn-sub'));
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
  return authOf(await insertGuest(connection.db));
}

async function authOf(userId: number) {
  return bearer(await signTestToken(String(userId)));
}
