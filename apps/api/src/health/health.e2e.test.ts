import {HttpStatus, type INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, it} from 'vitest';
import {AppModule} from '../app.module';

describe('GET /health', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({imports: [AppModule]}).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('정상 응답을 반환한다', async () => {
    await request(app.getHttpServer()).get('/health').expect(HttpStatus.OK, {status: 'ok'});
  });
});
