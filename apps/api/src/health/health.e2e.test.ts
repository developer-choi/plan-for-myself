import {HttpStatus, type INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import type {App} from 'supertest/types';
import {describe, it} from 'vitest';
import {AppModule} from '../app.module';
import {createDatabaseConnection, type DatabaseConnection} from '../db/database';
import {DATABASE_CONNECTION} from '../db/database.module';

describe('GET /health', () => {
  describe('General cases', () => {
    it('DB가 응답하면 정상 응답을 반환해야 한다', async () => {
      const app = await startApp(await createInMemoryConnection());
      try {
        await request(app.getHttpServer()).get('/health').expect(HttpStatus.OK, {status: 'ok'});
      } finally {
        await app.close();
      }
    });
  });

  describe('Edge cases', () => {
    it('DB 쿼리가 실패하면 500을 반환해야 한다', async () => {
      const app = await startApp(await createClosedConnection());
      try {
        await request(app.getHttpServer()).get('/health').expect(HttpStatus.INTERNAL_SERVER_ERROR);
      } finally {
        await app.close();
      }
    });
  });
});

function createInMemoryConnection() {
  return createDatabaseConnection({});
}

async function createClosedConnection(): Promise<DatabaseConnection> {
  const connection = await createInMemoryConnection();
  await connection.close();
  return {db: connection.db, close: () => Promise.resolve()};
}

async function startApp(connection: DatabaseConnection) {
  const moduleRef = await Test.createTestingModule({imports: [AppModule]})
    .overrideProvider(DATABASE_CONNECTION)
    .useValue(connection)
    .compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>({logger: false});
  await app.init();
  return app;
}
