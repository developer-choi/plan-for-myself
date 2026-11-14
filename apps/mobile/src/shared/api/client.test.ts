import {describe, expect, it} from '@jest/globals';
import {readSentToken, sendWithAppToken} from './client';

describe('sendWithAppToken()', () => {
  describe('General cases', () => {
    it('요청이 실패하면 읽은 토큰을 그 오류로 읽을 수 있어야 한다', async () => {
      const error = await captureRejection(sendWithAppToken(readToken(GUEST_TOKEN), rejectWith(new Error(FAILURE))));

      expect(readSentToken(error)).toBe(GUEST_TOKEN);
    });

    it('요청이 성공하면 결과를 그대로 반환해야 한다', async () => {
      await expect(sendWithAppToken(readToken(GUEST_TOKEN), () => Promise.resolve(RESULT))).resolves.toBe(RESULT);
    });
  });

  describe('Edge cases', () => {
    it('저장된 토큰이 없으면 실패한 오류에서 null을 읽어야 한다', async () => {
      const error = await captureRejection(sendWithAppToken(readToken(null), rejectWith(new Error(FAILURE))));

      expect(readSentToken(error)).toBeNull();
    });
  });
});

describe('readSentToken()', () => {
  describe('Edge cases', () => {
    it('이 클라이언트가 보내지 않은 오류면 undefined를 반환해야 한다', () => {
      expect(readSentToken(new Error(FAILURE))).toBeUndefined();
    });
  });
});

function readToken(token: string | null) {
  return () => Promise.resolve(token);
}

function rejectWith(error: Error) {
  return () => Promise.reject(error);
}

async function captureRejection(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('거절되지 않았다');
}

const GUEST_TOKEN = 'guest-token';
const RESULT = 'result';
const FAILURE = '요청 실패';
