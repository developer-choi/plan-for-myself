import {HttpStatus, type INestApplication} from '@nestjs/common';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {startApp} from './testing/start-app';

describe('CORS', () => {
  beforeAll(async () => {
    app = await startApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('CORS_ORIGINS에 적은 출처의 preflight면 204를 반환해야 한다', async () => {
      const response = await preflight(LISTED_ORIGIN);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    [LOCAL_WEB_ORIGIN, LISTED_ORIGIN].forEach((origin) => {
      it(`CORS_ORIGINS에 적은 출처(${origin})의 preflight면 그 출처를 허용 출처로 반환해야 한다`, async () => {
        const response = await preflight(origin);

        expect(response.headers['access-control-allow-origin']).toBe(origin);
      });
    });

    it('CORS_ORIGINS에 적은 출처의 preflight면 Authorization과 Content-Type 헤더를 허용해야 한다', async () => {
      const response = await preflight(LISTED_ORIGIN);

      expect(response.headers['access-control-allow-headers']).toBe('Authorization,Content-Type');
    });

    it('CORS_ORIGINS에 적은 출처의 preflight면 결과를 600초 동안 캐시하게 해야 한다', async () => {
      const response = await preflight(LISTED_ORIGIN);

      expect(response.headers['access-control-max-age']).toBe('600');
    });

    it('CORS_ORIGINS에 적은 출처의 실제 요청이면 응답에도 그 출처를 허용 출처로 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/health').set('Origin', LISTED_ORIGIN);

      expect(response.headers['access-control-allow-origin']).toBe(LISTED_ORIGIN);
    });
  });

  describe('Edge cases', () => {
    it('CORS_ORIGINS에 없는 출처의 preflight면 허용 출처를 반환하지 않아야 한다', async () => {
      const response = await preflight('http://evil.example');

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('preflight면 쿠키 자격 증명을 허용하지 않아야 한다', async () => {
      const response = await preflight(LISTED_ORIGIN);

      expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    });
  });
});

const LOCAL_WEB_ORIGIN = 'http://localhost:3000';
const LISTED_ORIGIN = 'https://web.example';

let app: INestApplication<App>;

function preflight(origin: string) {
  return request(app.getHttpServer())
    .options('/api/study-records')
    .set('Origin', origin)
    .set('Access-Control-Request-Method', 'POST')
    .set('Access-Control-Request-Headers', 'authorization,content-type');
}
