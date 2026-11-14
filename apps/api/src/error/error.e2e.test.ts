import {Public} from '@nestjs/authentication';
import {BadRequestException, Controller, Get, HttpStatus, type INestApplication} from '@nestjs/common';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {startApp} from '../testing/start-app';

describe('에러 응답', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await startApp(undefined, {controllers: [UnknownCodeProbeController]});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('/api 아래 없는 경로면 404 NOT_FOUND를 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get('/api/nothing-here').expect(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({code: 'NOT_FOUND', message: '요청한 주소를 찾을 수 없어요'});
    });
  });

  describe('Edge cases', () => {
    [
      {name: '깨진 JSON이면', status: HttpStatus.BAD_REQUEST, headers: {}, body: '{broken'},
      {
        name: 'gzip이라면서 gzip이 아니면',
        status: HttpStatus.BAD_REQUEST,
        headers: {'Content-Encoding': 'gzip'},
        body: '{}',
      },
      {
        name: '너무 크면',
        status: HttpStatus.PAYLOAD_TOO_LARGE,
        headers: {},
        body: 'a'.repeat(BODY_PARSER_DEFAULT_LIMIT_BYTES + 1),
      },
      {
        name: '모르는 인코딩이면',
        status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        headers: {'Content-Encoding': 'foo'},
        body: '{}',
      },
    ].forEach(({name, status, headers, body}) => {
      it(`본문이 ${name} ${status} INVALID_BODY와 요청 형식 안내 문구를 반환해야 한다`, async () => {
        const response = await request(app.getHttpServer())
          .post('/health')
          .set({'Content-Type': 'application/json', ...headers})
          .send(body)
          .expect(status);
        expect(response.body).toEqual({code: 'INVALID_BODY', message: '요청 형식이 올바르지 않아요'});
      });
    });

    it('BadRequestException에 등록되지 않은 code를 실으면 INVALID_BODY 응답으로 바꿔 반환해야 한다', async () => {
      const response = await request(app.getHttpServer()).get(`/api/${UNKNOWN_CODE_ROUTE}`);

      expect(response.body).toEqual({code: 'INVALID_BODY', message: '요청 형식이 올바르지 않아요'});
    });
  });
});

const BODY_PARSER_DEFAULT_LIMIT_BYTES = 102_400;
const UNKNOWN_CODE_ROUTE = 'unknown-code-probe';

@Public()
@Controller(UNKNOWN_CODE_ROUTE)
class UnknownCodeProbeController {
  @Get()
  read() {
    throw new BadRequestException({code: 'NOT_A_REGISTERED_CODE', message: '등록되지 않은 code'});
  }
}
