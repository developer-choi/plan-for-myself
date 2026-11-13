import {HttpStatus, type INestApplication} from '@nestjs/common';
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

    it('/docs면 문서 화면을 반환해야 한다', async () => {
      await request(app.getHttpServer()).get('/docs').expect(HttpStatus.OK).expect('Content-Type', /html/);
    });
  });
});
