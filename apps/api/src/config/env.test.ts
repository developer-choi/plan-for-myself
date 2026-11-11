import {describe, expect, it} from 'vitest';
import {envSchema} from './env';

describe('envSchema', () => {
  describe('General cases', () => {
    it('AUTH_SECRET이 64바이트면 검증을 통과해야 한다', () => {
      const secret = 'test-only-auth-secret-of-64-bytes-so-hs384-and-hs512-rows-fail!!';

      expect(envSchema.safeParse({AUTH_SECRET: secret}).success).toBe(true);
    });
  });

  describe('Boundary cases', () => {
    it('AUTH_SECRET이 31바이트면 32바이트 이상이어야 한다는 문구로 실패해야 한다', () => {
      expect(readIssueMessages({AUTH_SECRET: 'thirty-one-bytes-test-secret-x!'})).toEqual([TOO_SHORT_MESSAGE]);
    });

    it('AUTH_SECRET이 한글로 채운 32바이트면 검증을 통과해야 한다', () => {
      expect(envSchema.safeParse({AUTH_SECRET: '가나다라마바사아자차ab'}).success).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('AUTH_SECRET이 비어 있으면 32바이트 이상이어야 한다는 문구로 실패해야 한다', () => {
      expect(readIssueMessages({AUTH_SECRET: ''})).toEqual([TOO_SHORT_MESSAGE]);
    });

    it('AUTH_SECRET이 없으면 있어야 한다는 문구로 실패해야 한다', () => {
      expect(readIssueMessages({})).toEqual(['AUTH_SECRET이 있어야 한다']);
    });
  });
});

const TOO_SHORT_MESSAGE = 'AUTH_SECRET은 32바이트 이상이어야 한다';

/**
 * undefined: 검증을 통과했다
 */
function readIssueMessages(env: unknown) {
  return envSchema.safeParse(env).error?.issues.map((issue) => issue.message);
}
