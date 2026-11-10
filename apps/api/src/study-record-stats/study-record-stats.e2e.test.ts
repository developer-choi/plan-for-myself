import {HttpStatus, type INestApplication} from '@nestjs/common';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {bearer, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {insertGuest} from '../testing/users';

describe('통계 API', () => {
  beforeAll(async () => {
    connection = await createInMemoryConnection();
    app = await startApp(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('기준 날짜까지의 연속 기록과 누적을 반환해야 한다', async () => {
      const auth = await signIn();
      await createRecord(auth, '2026-09-23');
      await createRecord(auth, RECORD_DATE);

      const response = await request(app.getHttpServer())
        .get(OVERVIEW_PATH)
        .query({date: RECORD_DATE})
        .set('Authorization', auth);

      expect(response.body).toEqual({
        date: RECORD_DATE,
        firstRecordDate: '2026-09-23',
        streak: {current: 2, longest: 2},
        totals: {recordedDays: 2, studiedMinutes: MORNING_MINUTES * 2},
      });
    });

    it('그 달 통계에 전달 기록의 평균도 담아 반환해야 한다', async () => {
      const auth = await signIn();
      await createRecord(auth, '2026-08-31');
      await createRecord(auth, RECORD_DATE);

      const response = await request(app.getHttpServer())
        .get(MONTHLY_PATH)
        .query({month: MONTH, date: RECORD_DATE})
        .set('Authorization', auth);

      expect(response.body).toMatchObject({
        month: MONTH,
        study: {totalMinutes: MORNING_MINUTES, prevWeekdayAvg: MORNING_MINUTES},
      });
    });
  });

  describe('Edge cases', () => {
    it('기록이 없으면 첫 기록 날짜를 null로 반환해야 한다', async () => {
      const response = await request(app.getHttpServer())
        .get(OVERVIEW_PATH)
        .query({date: RECORD_DATE})
        .set('Authorization', await signIn());

      expect(response.body).toMatchObject({firstRecordDate: null});
    });

    it('토큰이 없으면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get(OVERVIEW_PATH).query({date: RECORD_DATE});

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toEqual({code: 'UNAUTHORIZED', message: '로그인이 필요해요'});
    });

    [
      {name: '기준 날짜가 없으면', query: {}, rejection: INVALID_DATE},
      {name: '기준 날짜가 미래면', query: {date: FUTURE_DATE}, rejection: FUTURE_LOOKUP_DATE},
    ].forEach(({name, query, rejection}) => {
      it(`누적 통계의 ${name} 400 ${rejection.code}를 반환해야 한다`, async () => {
        const response = await request(app.getHttpServer())
          .get(OVERVIEW_PATH)
          .query(query)
          .set('Authorization', await signIn());

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(rejection);
      });
    });

    [
      {name: '조회할 달이 없으면', query: {date: RECORD_DATE}, rejection: INVALID_MONTH},
      {name: '기준 날짜가 없으면', query: {month: MONTH}, rejection: INVALID_DATE},
      {name: '기준 날짜가 미래면', query: {month: MONTH, date: FUTURE_DATE}, rejection: FUTURE_LOOKUP_DATE},
      {
        name: '조회할 달이 기준 날짜보다 뒤면',
        query: {month: '2026-10', date: RECORD_DATE},
        rejection: {code: 'INVALID_MONTH', message: '미래 달은 조회할 수 없어요'},
      },
    ].forEach(({name, query, rejection}) => {
      it(`월 통계의 ${name} 400 ${rejection.code}를 반환해야 한다`, async () => {
        const response = await request(app.getHttpServer())
          .get(MONTHLY_PATH)
          .query(query)
          .set('Authorization', await signIn());

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(rejection);
      });
    });

    describe('월 통계의 조회할 달이 없으면', () => {
      it('기준 날짜도 없을 때 달 오류를 먼저 400 INVALID_MONTH로 반환해야 한다', async () => {
        const response = await request(app.getHttpServer())
          .get(MONTHLY_PATH)
          .set('Authorization', await signIn());

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(INVALID_MONTH);
      });
    });

    describe('월 통계의 기준 날짜가 미래면', () => {
      it('조회할 달이 그보다 뒤일 때 날짜 오류를 먼저 400 INVALID_DATE로 반환해야 한다', async () => {
        const response = await request(app.getHttpServer())
          .get(MONTHLY_PATH)
          .query({month: '9998-12', date: '9998-11-30'})
          .set('Authorization', await signIn());

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(FUTURE_LOOKUP_DATE);
      });
    });
  });
});

const OVERVIEW_PATH = '/api/study-record-stats/overview';
const MONTHLY_PATH = '/api/study-record-stats/monthly';
const MONTH = '2026-09';
const RECORD_DATE = `${MONTH}-24`;
const FUTURE_DATE = '9998-12-31';
const MORNING_MINUTES = 30;
const INVALID_DATE = {code: 'INVALID_DATE', message: '날짜가 올바르지 않아요'};
const INVALID_MONTH = {code: 'INVALID_MONTH', message: '조회할 달이 올바르지 않아요'};
const FUTURE_LOOKUP_DATE = {code: 'INVALID_DATE', message: '오늘과 지난 날짜만 조회할 수 있어요'};

let connection: DatabaseConnection;
let app: INestApplication<App>;

async function signIn() {
  return bearer(await signTestToken(String(await insertGuest(connection.db))));
}

async function createRecord(auth: string, date: string) {
  await request(app.getHttpServer())
    .post('/api/study-records')
    .set('Authorization', auth)
    .send({date, dateType: 'weekday', studiedMinutes: [MORNING_MINUTES, 0, 0], failTags: []})
    .expect(HttpStatus.CREATED);
}
