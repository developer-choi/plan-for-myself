import {HttpStatus, type INestApplication} from '@nestjs/common';
import {
  FAILURE_TAG_STATUSES,
  FAILURE_TAG_TREND_STATUSES,
  RECORD_REJECTION_CODES,
} from '@plan-for-myself/shared/study-record';
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

    [
      {
        name: '실패 태그 상태',
        statusSchema: {status: {enum: FAILURE_TAG_STATUSES}},
      },
      {
        name: '추이 상태',
        statusSchema: {trend: {items: {properties: {status: {enum: FAILURE_TAG_TREND_STATUSES}}}}},
      },
    ].forEach(({name, statusSchema}) => {
      it(`/docs-json이면 월 통계의 ${name}에 shared 상태 값을 실어야 한다`, async () => {
        const response = await request(app.getHttpServer()).get('/docs-json');

        expect(response.body).toMatchObject({
          paths: {
            '/api/study-record-stats/monthly': {
              get: {
                responses: {
                  [HttpStatus.OK]: {
                    content: {
                      'application/json': {schema: {properties: {failureTags: {items: {properties: statusSchema}}}}},
                    },
                  },
                },
              },
            },
          },
        });
      });
    });

    it('/docs-json이면 월 통계의 400 응답에 달·날짜 code를 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toMatchObject({
        paths: {
          '/api/study-record-stats/monthly': {
            get: {
              responses: {
                [HttpStatus.BAD_REQUEST]: {
                  content: {
                    'application/json': {schema: {properties: {code: {enum: ['INVALID_MONTH', 'INVALID_DATE']}}}},
                  },
                },
              },
            },
          },
        },
      });
    });

    it('/docs-json이면 예시 API에 인증을 싣지 않아야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toHaveProperty(DEMO_GET_PATH);
      expect(response.body).not.toHaveProperty([...DEMO_GET_PATH, 'security']);
    });

    it('/docs-json이면 예시 API 응답의 첫 기록 날짜를 비어 있을 수 없게 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toHaveProperty(
        [...DEMO_OK_SCHEMA_PATH, 'properties', 'overview', 'properties', 'firstRecordDate', 'type'],
        'string',
      );
      expect(response.body).not.toHaveProperty([
        ...DEMO_OK_SCHEMA_PATH,
        'properties',
        'overview',
        'properties',
        'firstRecordDate',
        'nullable',
      ]);
    });

    it('/docs-json이면 예시 API 응답의 월 통계를 비어 있을 수 있게 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toHaveProperty([...DEMO_OK_SCHEMA_PATH, 'properties', 'monthly', 'nullable'], true);
    });

    it('/docs-json이면 Google idToken 교환의 200 응답에 토큰과 거절 두 모양을 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toMatchObject({
        paths: {
          '/api/app-token': {
            post: {
              responses: {
                [HttpStatus.OK]: {
                  content: {
                    'application/json': {
                      schema: {
                        oneOf: [
                          {properties: {type: {enum: ['session']}}, required: ['type', 'token']},
                          {properties: {type: {enum: ['registered-account']}}, required: ['type', 'rejection']},
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    it('/docs-json이면 Google idToken 교환의 경합 응답에 LOGIN_CONFLICT code를 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toMatchObject({
        paths: {
          '/api/app-token': {
            post: {
              responses: {
                [HttpStatus.CONFLICT]: {
                  content: {'application/json': {schema: {properties: {code: {enum: ['LOGIN_CONFLICT']}}}}},
                },
              },
            },
          },
        },
      });
    });

    it('/docs-json이면 게스트 발급의 한도 응답에 guest_limit code를 실어야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toMatchObject({
        paths: {
          '/api/app-token/guest': {
            post: {
              responses: {
                [HttpStatus.TOO_MANY_REQUESTS]: {
                  content: {'application/json': {schema: {properties: {code: {enum: ['guest_limit']}}}}},
                },
              },
            },
          },
        },
      });
    });

    it('/docs-json이면 게스트 발급에 인증을 싣지 않아야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/docs-json');

      expect(response.body).toHaveProperty(GUEST_POST_PATH);
      expect(response.body).not.toHaveProperty([...GUEST_POST_PATH, 'security']);
    });

    it('/docs면 문서 화면을 반환해야 한다', async () => {
      await request(app.getHttpServer()).get('/docs').expect(HttpStatus.OK).expect('Content-Type', /html/);
    });
  });
});

const DEMO_GET_PATH = ['paths', '/api/demo', 'get'];
const GUEST_POST_PATH = ['paths', '/api/app-token/guest', 'post'];
const DEMO_OK_SCHEMA_PATH = [
  ...DEMO_GET_PATH,
  'responses',
  String(HttpStatus.OK),
  'content',
  'application/json',
  'schema',
];
