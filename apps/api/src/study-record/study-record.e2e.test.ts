import {HttpStatus, type INestApplication} from '@nestjs/common';
import {STUDY_RECORD_FIELD_MESSAGES} from '@plan-for-myself/shared/study-record';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {bearer, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {insertGuest} from '../testing/users';

describe('기록 API', () => {
  beforeAll(async () => {
    connection = await createInMemoryConnection();
    app = await startApp(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('기록을 추가하면 201을 반환해야 한다', async () => {
      await request(app.getHttpServer())
        .post(RECORDS_PATH)
        .set('Authorization', await signIn())
        .send(createBody(RECORD_DATE))
        .expect(HttpStatus.CREATED);
    });

    it('기록을 추가하면 추가한 기록을 반환해야 한다', async () => {
      const response = await request(app.getHttpServer())
        .post(RECORDS_PATH)
        .set('Authorization', await signIn())
        .send(createBody(RECORD_DATE));

      expect(response.body).toEqual({pk: expect.any(Number) as number, ...createBody(RECORD_DATE)});
    });

    it('달을 주면 그 달의 내 기록을 반환해야 한다', async () => {
      const auth = await signIn();
      await createRecord(auth, RECORD_DATE);
      await createRecord(await signIn(), RECORD_DATE);

      const response = await request(app.getHttpServer())
        .get(RECORDS_PATH)
        .query({month: '2026-09'})
        .set('Authorization', auth);

      expect(response.body).toEqual([{pk: expect.any(Number) as number, ...createBody(RECORD_DATE)}]);
    });

    it('기록을 고치면 고친 기록을 반환해야 한다', async () => {
      const auth = await signIn();
      const pk = await createRecord(auth, RECORD_DATE);
      const fields = {dateType: 'holiday', studiedMinutes: [0, 0, 0], failTags: ['늦잠']};

      const response = await request(app.getHttpServer())
        .patch(`${RECORDS_PATH}/${pk}`)
        .set('Authorization', auth)
        .send(fields);

      expect(response.body).toEqual({pk, date: RECORD_DATE, ...fields});
    });

    it('기록을 지우면 204를 반환해야 한다', async () => {
      const auth = await signIn();
      const pk = await createRecord(auth, RECORD_DATE);

      await request(app.getHttpServer())
        .delete(`${RECORDS_PATH}/${pk}`)
        .set('Authorization', auth)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('Edge cases', () => {
    it('지운 기록을 다시 지우면 404 NOT_FOUND를 반환해야 한다', async () => {
      const auth = await signIn();
      const pk = await createRecord(auth, RECORD_DATE);
      await request(app.getHttpServer()).delete(`${RECORDS_PATH}/${pk}`).set('Authorization', auth);

      const response = await request(app.getHttpServer()).delete(`${RECORDS_PATH}/${pk}`).set('Authorization', auth);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual(RECORD_NOT_FOUND);
    });

    [
      {
        name: 'JSON 본문이 비어 있으면 400 INVALID_DATE를',
        send: () => request(app.getHttpServer()).post(RECORDS_PATH).set('Content-Type', 'application/json').send(''),
        rejection: {code: 'INVALID_DATE', message: '날짜가 올바르지 않아요'},
      },
      {
        name: 'Content-Type이 text/plain이면 400 INVALID_BODY를',
        send: () =>
          request(app.getHttpServer())
            .post(RECORDS_PATH)
            .set('Content-Type', 'text/plain')
            .send(JSON.stringify(createBody(RECORD_DATE))),
        rejection: INVALID_BODY,
      },
      {
        name: '조회할 달을 두 번 주면 400 INVALID_MONTH를',
        send: () => request(app.getHttpServer()).get(`${RECORDS_PATH}?month=2026-09&month=2026-10`),
        rejection: {code: 'INVALID_MONTH', message: '조회할 달이 올바르지 않아요'},
      },
    ].forEach(({name, send, rejection}) => {
      it(`${name} 반환해야 한다`, async () => {
        const response = await send().set('Authorization', await signIn());

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(rejection);
      });
    });

    it('토큰이 없으면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get(RECORDS_PATH).query({month: '2026-09'});

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toEqual({code: 'UNAUTHORIZED', message: '로그인이 필요해요'});
    });

    [
      {name: '달이 없으면', query: {}},
      {name: '13월이면', query: {month: '2026-13'}},
    ].forEach(({name, query}) => {
      it(`조회할 ${name} 400 INVALID_MONTH를 반환해야 한다`, async () => {
        const response = await request(app.getHttpServer())
          .get(RECORDS_PATH)
          .query(query)
          .set('Authorization', await signIn());

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual({code: 'INVALID_MONTH', message: '조회할 달이 올바르지 않아요'});
      });
    });

    [
      {
        name: '공부시간이 정수가 아니면',
        body: {...createBody(RECORD_DATE), studiedMinutes: [NON_INTEGER_MINUTES, 0, 0]},
        rejection: {code: 'INVALID_STUDIED_MINUTES', message: STUDY_RECORD_FIELD_MESSAGES.studiedMinutes},
      },
      {
        name: '미래 날짜면',
        body: createBody(FUTURE_DATE),
        rejection: {code: 'INVALID_DATE', message: STUDY_RECORD_FIELD_MESSAGES.futureDate},
      },
    ].forEach(({name, body, rejection}) => {
      it(`추가할 기록이 ${name} 400 ${rejection.code}를 반환해야 한다`, async () => {
        const response = await request(app.getHttpServer())
          .post(RECORDS_PATH)
          .set('Authorization', await signIn())
          .send(body);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(rejection);
      });
    });

    describe('추가할 기록이 미래 날짜면', () => {
      it('빈 기록이기도 하면 400 EMPTY_RECORD를 반환해야 한다', async () => {
        const response = await request(app.getHttpServer())
          .post(RECORDS_PATH)
          .set('Authorization', await signIn())
          .send({...createBody(FUTURE_DATE), studiedMinutes: [0, 0, 0], failTags: []});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual({code: 'EMPTY_RECORD', message: STUDY_RECORD_FIELD_MESSAGES.emptyRecord});
      });
    });

    it('같은 날짜에 두 번 추가하면 409 DUPLICATE_DATE를 반환해야 한다', async () => {
      const auth = await signIn();
      await createRecord(auth, RECORD_DATE);

      const response = await request(app.getHttpServer())
        .post(RECORDS_PATH)
        .set('Authorization', auth)
        .send(createBody(RECORD_DATE));

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body).toEqual({code: 'DUPLICATE_DATE', message: '이 날짜엔 이미 기록이 있어요'});
    });

    it('고칠 때 날짜를 보내면 400 INVALID_DATE를 반환해야 한다', async () => {
      const auth = await signIn();
      const pk = await createRecord(auth, RECORD_DATE);

      const response = await request(app.getHttpServer())
        .patch(`${RECORDS_PATH}/${pk}`)
        .set('Authorization', auth)
        .send(createBody('2026-09-25'));

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        code: 'INVALID_DATE',
        message: '날짜는 바꿀 수 없어요. 삭제하고 그 날짜에 새로 기록해 주세요',
      });
    });

    it('빈 기록으로 고치면 400 EMPTY_RECORD를 반환해야 한다', async () => {
      const auth = await signIn();
      const pk = await createRecord(auth, RECORD_DATE);

      const response = await request(app.getHttpServer())
        .patch(`${RECORDS_PATH}/${pk}`)
        .set('Authorization', auth)
        .send({dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: []});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({code: 'EMPTY_RECORD', message: STUDY_RECORD_FIELD_MESSAGES.emptyRecord});
    });

    [
      {name: '숫자가 아니면', pk: 'abc'},
      {name: '0이면', pk: '0'},
      {name: 'Postgres int 범위를 넘으면', pk: '2147483648'},
    ].forEach(({name, pk}) => {
      describe(`고칠 기록의 pk가 ${name}`, () => {
        it('본문 값이 틀렸으면 404 NOT_FOUND를 반환해야 한다', async () => {
          const response = await request(app.getHttpServer())
            .patch(`${RECORDS_PATH}/${pk}`)
            .set('Authorization', await signIn())
            .send({});

          expect(response.status).toBe(HttpStatus.NOT_FOUND);
          expect(response.body).toEqual(RECORD_NOT_FOUND);
        });

        it('JSON 본문이 깨졌으면 400 INVALID_BODY를 반환해야 한다', async () => {
          const response = await request(app.getHttpServer())
            .patch(`${RECORDS_PATH}/${pk}`)
            .set('Authorization', await signIn())
            .set('Content-Type', 'application/json')
            .send('{broken');

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
          expect(response.body).toEqual(INVALID_BODY);
        });
      });
    });

    it('남의 기록을 고치면 404 NOT_FOUND를 반환해야 한다', async () => {
      const pk = await createRecord(await signIn(), RECORD_DATE);

      const response = await request(app.getHttpServer())
        .patch(`${RECORDS_PATH}/${pk}`)
        .set('Authorization', await signIn())
        .send({dateType: 'weekday', studiedMinutes: [MORNING_MINUTES, 0, 0], failTags: []});

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual(RECORD_NOT_FOUND);
    });
  });
});

const RECORDS_PATH = '/api/study-records';
const RECORD_DATE = '2026-09-24';
const MORNING_MINUTES = 30;
const NON_INTEGER_MINUTES = 1.5;
const FUTURE_DATE = '9998-12-31';
const RECORD_NOT_FOUND = {code: 'NOT_FOUND', message: '기록을 찾을 수 없어요'};
const INVALID_BODY = {code: 'INVALID_BODY', message: '요청 형식이 올바르지 않아요'};

let connection: DatabaseConnection;
let app: INestApplication<App>;

function createBody(date: string) {
  return {date, dateType: 'weekday', studiedMinutes: [MORNING_MINUTES, 0, 0], failTags: ['늦잠']};
}

async function signIn() {
  return bearer(await signTestToken(String(await insertGuest(connection.db))));
}

async function createRecord(auth: string, date: string): Promise<number> {
  const response = await request(app.getHttpServer())
    .post(RECORDS_PATH)
    .set('Authorization', auth)
    .send(createBody(date))
    .expect(HttpStatus.CREATED);
  return (response.body as {pk: number}).pk;
}
