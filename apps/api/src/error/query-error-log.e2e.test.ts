import {Public} from '@nestjs/authentication';
import {Controller, Get, type INestApplication, type LoggerService} from '@nestjs/common';
import {sql} from 'drizzle-orm';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, beforeEach, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {createInMemoryConnection, startApp} from '../testing/start-app';

describe('쿼리 실패 로그', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    connection = await createInMemoryConnection();
    app = await startApp(connection, {controllers: [QueryErrorProbeController]});
    app.useLogger(new ErrorLogCollector());
  });

  beforeEach(() => {
    errorLogs.length = 0;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Edge cases', () => {
    it('쿼리가 실패하면 Postgres 오류 code를 로그에 남겨야 한다', async () => {
      await request(app.getHttpServer()).get(`/api/${PROBE_ROUTE}`);

      expect(errorLogs.join('\n')).toContain(`"code":"${INVALID_TEXT_REPRESENTATION}"`);
    });

    it('쿼리가 실패하면 쿼리에 넣은 값을 로그에 남기지 않아야 한다', async () => {
      await request(app.getHttpServer()).get(`/api/${PROBE_ROUTE}`);

      expect(errorLogs.join('\n')).not.toContain(QUERY_VALUE);
    });
  });
});

const PROBE_ROUTE = 'query-error-probe';
const QUERY_VALUE = 'user-private-value';
const INVALID_TEXT_REPRESENTATION = '22P02';
const errorLogs: string[] = [];

let connection: DatabaseConnection;

@Public()
@Controller(PROBE_ROUTE)
class QueryErrorProbeController {
  @Get()
  async read() {
    await connection.db.execute(sql`SELECT ${QUERY_VALUE}::int`);
  }
}

class ErrorLogCollector implements LoggerService {
  log() {}

  warn() {}

  error(...messages: unknown[]) {
    errorLogs.push(messages.map(String).join('\n'));
  }
}
