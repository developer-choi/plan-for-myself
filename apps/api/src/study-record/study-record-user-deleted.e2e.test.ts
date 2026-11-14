import {HttpStatus, type INestApplication} from '@nestjs/common';
import {sql} from 'drizzle-orm';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {bearer, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {insertGuest} from '../testing/users';

describe('기록 추가 중 탈퇴', () => {
  let connection: DatabaseConnection;
  let app: INestApplication<App>;

  beforeAll(async () => {
    connection = await createInMemoryConnection();
    app = await startApp(connection);
    await connection.db.execute(sql`
      CREATE FUNCTION delete_record_owner() RETURNS trigger AS $$
      BEGIN
        DELETE FROM users WHERE id = NEW.user_id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql`);
    await connection.db.execute(sql`
      CREATE TRIGGER delete_record_owner BEFORE INSERT ON study_records
      FOR EACH ROW EXECUTE FUNCTION delete_record_owner()`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Edge cases', () => {
    it('인증을 통과한 뒤 기록을 넣기 전에 사용자 행이 지워지면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const auth = bearer(await signTestToken(String(await insertGuest(connection.db))));

      const response = await request(app.getHttpServer())
        .post('/api/study-records')
        .set('Authorization', auth)
        .send({date: '2026-09-24', dateType: 'weekday', studiedMinutes: [MORNING_MINUTES, 0, 0], failTags: []});

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toEqual({code: 'UNAUTHORIZED', message: '로그인이 필요해요'});
    });
  });
});

const MORNING_MINUTES = 30;
