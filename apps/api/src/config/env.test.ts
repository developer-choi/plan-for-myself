import {describe, expect, it} from 'vitest';
import {envSchema} from './env';

describe('envSchema', () => {
  describe('General cases', () => {
    it('AUTH_SECRET이 64바이트이고 AUTH_GOOGLE_ID가 있으면 검증을 통과해야 한다', () => {
      const secret = 'test-only-auth-secret-of-64-bytes-so-hs384-and-hs512-rows-fail!!';

      expect(envSchema.safeParse({...VALID_ENV, AUTH_SECRET: secret}).success).toBe(true);
    });
  });

  describe('Boundary cases', () => {
    it('AUTH_SECRET이 31바이트면 32바이트 이상이어야 한다는 문구로 실패해야 한다', () => {
      expect(readIssueMessages({...VALID_ENV, AUTH_SECRET: 'thirty-one-bytes-test-secret-x!'})).toEqual([
        TOO_SHORT_MESSAGE,
      ]);
    });

    it('AUTH_SECRET이 한글로 채운 32바이트면 검증을 통과해야 한다', () => {
      expect(envSchema.safeParse({...VALID_ENV, AUTH_SECRET: '가나다라마바사아자차ab'}).success).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('AUTH_SECRET이 비어 있으면 32바이트 이상이어야 한다는 문구로 실패해야 한다', () => {
      expect(readIssueMessages({...VALID_ENV, AUTH_SECRET: ''})).toEqual([TOO_SHORT_MESSAGE]);
    });

    it('AUTH_SECRET이 없으면 있어야 한다는 문구로 실패해야 한다', () => {
      expect(readIssueMessages({...VALID_ENV, AUTH_SECRET: undefined})).toEqual(['AUTH_SECRET이 있어야 한다']);
    });

    it('AUTH_GOOGLE_ID가 비어 있으면 비어 있다는 문구로 실패해야 한다', () => {
      expect(readIssueMessages({...VALID_ENV, AUTH_GOOGLE_ID: ''})).toEqual(['AUTH_GOOGLE_ID가 비어 있다']);
    });

    it('AUTH_GOOGLE_ID가 없으면 있어야 한다는 문구로 실패해야 한다', () => {
      expect(readIssueMessages({...VALID_ENV, AUTH_GOOGLE_ID: undefined})).toEqual(['AUTH_GOOGLE_ID가 있어야 한다']);
    });
  });

  describe('CORS_ORIGINS', () => {
    describe('General cases', () => {
      it('쉼표로 나눈 출처 목록이면 공백을 뗀 출처 배열로 읽어야 한다', () => {
        expect(readCorsOrigins('https://a.example, https://b.example')).toEqual([
          'https://a.example',
          'https://b.example',
        ]);
      });
    });

    describe('Boundary cases', () => {
      it('포트가 붙은 출처는 그대로 읽어야 한다', () => {
        expect(readCorsOrigins('http://localhost:3000')).toEqual(['http://localhost:3000']);
      });
    });

    describe('Edge cases', () => {
      it('없으면 있어야 한다는 문구로 실패해야 한다', () => {
        expect(readIssueMessages({...VALID_ENV, CORS_ORIGINS: undefined})).toEqual(['CORS_ORIGINS가 있어야 한다']);
      });

      ['', ' , '].forEach((value) => {
        it(`'${value}'처럼 출처가 하나도 없으면 비어 있다는 문구로 실패해야 한다`, () => {
          expect(readIssueMessages({...VALID_ENV, CORS_ORIGINS: value})).toEqual(['CORS_ORIGINS가 비어 있다']);
        });
      });

      [
        {name: '끝 슬래시가 붙은 값', value: 'https://a.example/'},
        {name: '경로가 붙은 값', value: 'https://a.example/app'},
        {name: '대문자가 섞인 값', value: 'https://A.example'},
        {name: 'scheme이 없는 값', value: 'a.example'},
        {name: '주소가 아닌 값', value: 'not-a-url'},
      ].forEach(({name, value}) => {
        it(`${name}(${value})이 섞이면 출처가 아니라는 문구로 실패해야 한다`, () => {
          expect(readIssueMessages({...VALID_ENV, CORS_ORIGINS: `https://b.example, ${value}`})).toEqual([
            NOT_ORIGIN_MESSAGE,
          ]);
        });
      });
    });
  });
});

const TOO_SHORT_MESSAGE = 'AUTH_SECRET은 32바이트 이상이어야 한다';
const NOT_ORIGIN_MESSAGE = 'CORS_ORIGINS에 출처(scheme://host[:port])가 아닌 값이 있다';
const VALID_ENV = {
  AUTH_SECRET: 'a-valid-auth-secret-of-at-least-32-bytes',
  AUTH_GOOGLE_ID: 'google-client-id',
  CORS_ORIGINS: 'http://localhost:3000',
};

/**
 * undefined: 검증을 통과했다
 */
function readIssueMessages(env: unknown) {
  return envSchema.safeParse(env).error?.issues.map((issue) => issue.message);
}

function readCorsOrigins(value: string) {
  return envSchema.parse({...VALID_ENV, CORS_ORIGINS: value}).CORS_ORIGINS;
}
