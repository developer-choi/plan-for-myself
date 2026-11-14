import {HttpStatus} from '@nestjs/common';
import request from 'supertest';
import {describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {createInMemoryConnection, startApp} from '../testing/start-app';

describe('GET /health', () => {
  describe('General cases', () => {
    it('DB가 응답하면 정상 응답을 반환해야 한다', async () => {
      const app = await startApp();
      try {
        await request(app.getHttpServer()).get('/health').expect(HttpStatus.OK, {status: 'ok'});
      } finally {
        await app.close();
      }
    });

    it('헬스 체크는 /api 접두사 밖에 있어야 한다', async () => {
      const app = await startApp();
      try {
        await request(app.getHttpServer()).get('/api/health').expect(HttpStatus.NOT_FOUND);
      } finally {
        await app.close();
      }
    });
  });

  describe('Edge cases', () => {
    it('DB 쿼리가 실패하면 500 INTERNAL_ERROR와 안내 문구를 반환해야 한다', async () => {
      const app = await startApp(await createClosedConnection());
      try {
        const response = await request(app.getHttpServer()).get('/health').expect(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).toEqual({
          code: 'INTERNAL_ERROR',
          message: '서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요',
        });
      } finally {
        await app.close();
      }
    });
  });
});

async function createClosedConnection(): Promise<DatabaseConnection> {
  const connection = await createInMemoryConnection();
  await connection.close();
  return {db: connection.db, close: () => Promise.resolve()};
}
