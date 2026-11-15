import {sql} from 'drizzle-orm';
import {afterAll, assert, beforeAll, describe, expect, it} from 'vitest';
import {createInMemoryConnection} from '../testing/start-app';
import type {DatabaseConnection} from './database';
import {describeQueryCause} from './postgres-error';

describe('describeQueryCause()', () => {
  let connection: DatabaseConnection;

  beforeAll(async () => {
    connection = await createInMemoryConnection();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('General cases', () => {
    it('Postgres 오류가 원인이면 code는 남기고 쿼리에 넣은 값은 반환하지 않아야 한다', async () => {
      const result = describeQueryCause(await readQueryCause(connection));

      expect(result).toContain(INVALID_TEXT_REPRESENTATION);
      expect(result).not.toContain(QUERY_VALUE);
    });

    it('code 없는 Error가 원인이면 이름과 message를 반환해야 한다', () => {
      expect(describeQueryCause(new TypeError('연결이 끊겼다'))).toBe('TypeError: 연결이 끊겼다');
    });
  });

  describe('Edge cases', () => {
    it('원인이 없으면 알 수 없음을 반환해야 한다', () => {
      expect(describeQueryCause(undefined)).toBe('알 수 없음');
    });
  });
});

const QUERY_VALUE = 'user-private-value';
const INVALID_TEXT_REPRESENTATION = '22P02';

async function readQueryCause(connection: DatabaseConnection): Promise<unknown> {
  try {
    await connection.db.execute(sql`SELECT ${QUERY_VALUE}::int`);
  } catch (error) {
    return (error as Error).cause;
  }
  assert.fail('형 변환이 실패해야 하는 쿼리가 성공했다');
}
