import {HttpStatus, type INestApplication} from '@nestjs/common';
import {getDemoResponse, getDemoToday} from '@plan-for-myself/shared/demo';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {startApp} from '../testing/start-app';

describe('예시 API', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await startApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('토큰 없이 부르면 200을 반환해야 한다', async () => {
      await request(app.getHttpServer()).get(DEMO_PATH).expect(HttpStatus.OK);
    });

    it('달을 주지 않으면 웹과 같은 이번 달 예시 응답을 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get(DEMO_PATH);

      expect(response.body).toEqual(getDemoResponse(null));
    });

    it('이번 달을 주면 그 달의 월 통계를 담아야 한다', async () => {
      const month = getDemoToday().slice(0, MONTH_LENGTH);

      const response = await request(app.getHttpServer()).get(DEMO_PATH).query({month});

      expect(response.body).toMatchObject({monthly: {month}});
    });
  });

  describe('Edge cases', () => {
    it('미래 달이면 월 통계를 null로 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get(DEMO_PATH).query({month: '9998-12'});

      expect(response.body).toMatchObject({monthly: null});
    });

    [
      {name: '13월이면', month: '2026-13'},
      {name: '비어 있으면', month: ''},
    ].forEach(({name, month}) => {
      it(`조회할 달이 ${name} 400 INVALID_MONTH를 반환해야 한다`, async () => {
        const response = await request(app.getHttpServer()).get(DEMO_PATH).query({month});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual({code: 'INVALID_MONTH', message: '조회할 달이 올바르지 않아요'});
      });
    });
  });
});

const DEMO_PATH = '/api/demo';
const MONTH_LENGTH = 'YYYY-MM'.length;
