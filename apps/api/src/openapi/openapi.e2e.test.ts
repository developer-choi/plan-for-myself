import {HttpStatus, type INestApplication} from '@nestjs/common';
import {RECORD_REJECTION_CODES} from '@plan-for-myself/shared/study-record';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {startApp} from '../testing/start-app';

describe('OpenAPI 문서', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await startApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('/docs-json이면 헬스 체크 경로가 실린 문서를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json').expect(HttpStatus.OK);
      expect(response.body).toMatchObject({paths: {'/health': {get: expect.any(Object) as object}}});
    });

    it('/docs-json이면 기록 경로에 Bearer 인증을 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toMatchObject({
        components: {securitySchemes: {bearer: {type: 'http', scheme: 'bearer'}}},
        paths: {'/api/study-records': {get: {security: [{bearer: []}]}}},
      });
    });

    it('/docs-json이면 기록 추가의 날짜 중복 응답에 DUPLICATE_DATE code를 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toMatchObject({
        paths: {
          '/api/study-records': {
            post: {
              responses: {
                [HttpStatus.CONFLICT]: {
                  content: {'application/json': {schema: {properties: {code: {enum: ['DUPLICATE_DATE']}}}}},
                },
              },
            },
          },
        },
      });
    });

    it('/docs-json이면 기록 추가의 400 응답에 검증이 낼 수 있는 code를 모두 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toMatchObject({
        paths: {
          '/api/study-records': {
            post: {
              responses: {
                [HttpStatus.BAD_REQUEST]: {
                  content: {'application/json': {schema: {properties: {code: {enum: RECORD_REJECTION_CODES}}}}},
                },
              },
            },
          },
        },
      });
    });

    it('/docs면 문서 화면을 반환해야 한다', async () => {
      await request(app.getHttpServer()).get('/docs').expect(HttpStatus.OK).expect('Content-Type', /html/);
    });
  });
});
