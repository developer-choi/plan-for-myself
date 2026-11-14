// @vitest-environment node
import {ImpossibleStateError} from '@plan-for-myself/shared/error';
import {UnsecuredJWT} from 'jose';
import {describe, expect, it} from 'vitest';
import {
  getRefreshRetryAt,
  isRefreshRetryWaiting,
  readAppTokenClaims,
  shouldRefreshAppToken,
} from '@/auth/app-token-session';

describe('readAppTokenClaims()', () => {
  describe('General cases', () => {
    it('게스트 토큰이면 사용자 번호·게스트 여부·만료 시각을 반환해야 한다', () => {
      const token = createToken({sub: '12', isGuest: true, exp: NOW_SECONDS + THIRTY_DAYS});

      expect(readAppTokenClaims(token)).toEqual({
        userId: '12',
        isGuest: true,
        expiresAt: NOW_SECONDS + THIRTY_DAYS,
      });
    });

    it('Google 계정 토큰이면 게스트가 아니라고 반환해야 한다', () => {
      const token = createToken({sub: '12', exp: NOW_SECONDS + THIRTY_DAYS});

      expect(readAppTokenClaims(token).isGuest).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('만료 시각이 없는 토큰이면 만료 시각을 null로 반환해야 한다', () => {
      expect(readAppTokenClaims(createToken({sub: '12'})).expiresAt).toBeNull();
    });

    it('사용자 번호가 없는 토큰이면 ImpossibleStateError를 던져야 한다', () => {
      expect(() => readAppTokenClaims(createToken({exp: NOW_SECONDS}))).toThrow(ImpossibleStateError);
    });
  });
});

describe('shouldRefreshAppToken()', () => {
  describe('General cases', () => {
    it('만료까지 30일 남았으면 false를 반환해야 한다', () => {
      const token = createToken({sub: '1', exp: NOW_SECONDS + THIRTY_DAYS});

      expect(shouldRefreshAppToken(token, NOW_MS)).toBe(false);
    });

    it('만료까지 3일 남았으면 true를 반환해야 한다', () => {
      const token = createToken({sub: '1', exp: NOW_SECONDS + THREE_DAYS});

      expect(shouldRefreshAppToken(token, NOW_MS)).toBe(true);
    });
  });

  describe('Boundary cases', () => {
    it('만료까지 정확히 7일 남았으면 false를 반환해야 한다', () => {
      const token = createToken({sub: '1', exp: NOW_SECONDS + SEVEN_DAYS});

      expect(shouldRefreshAppToken(token, NOW_MS)).toBe(false);
    });

    it('만료까지 7일에서 1초 모자라면 true를 반환해야 한다', () => {
      const token = createToken({sub: '1', exp: NOW_SECONDS + SEVEN_DAYS - 1});

      expect(shouldRefreshAppToken(token, NOW_MS)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('만료 시각이 없는 토큰이면 true를 반환해야 한다', () => {
      expect(shouldRefreshAppToken(createToken({sub: '1'}), NOW_MS)).toBe(true);
    });
  });
});

describe('getRefreshRetryAt()', () => {
  describe('General cases', () => {
    it('실패한 시각에서 5분 뒤를 반환해야 한다', () => {
      expect(getRefreshRetryAt(NOW_MS)).toBe(NOW_MS + FIVE_MINUTES_MS);
    });
  });
});

describe('isRefreshRetryWaiting()', () => {
  describe('General cases', () => {
    it('갱신에 실패한 직후면 true를 반환해야 한다', () => {
      expect(isRefreshRetryWaiting(getRefreshRetryAt(NOW_MS), NOW_MS)).toBe(true);
    });

    it('갱신에 실패한 적 없으면 false를 반환해야 한다', () => {
      expect(isRefreshRetryWaiting(undefined, NOW_MS)).toBe(false);
    });
  });

  describe('Boundary cases', () => {
    it('다시 갱신할 시각이 되면 false를 반환해야 한다', () => {
      const retryAt = getRefreshRetryAt(NOW_MS);

      expect(isRefreshRetryWaiting(retryAt, retryAt)).toBe(false);
    });

    it('다시 갱신할 시각 1밀리초 전이면 true를 반환해야 한다', () => {
      const retryAt = getRefreshRetryAt(NOW_MS);

      expect(isRefreshRetryWaiting(retryAt, retryAt - 1)).toBe(true);
    });
  });
});

const SECONDS_PER_DAY = 86_400;
const MILLISECONDS_PER_SECOND = 1000;
const THIRTY = 30;
const SEVEN = 7;
const THREE = 3;
const THIRTY_DAYS = THIRTY * SECONDS_PER_DAY;
const SEVEN_DAYS = SEVEN * SECONDS_PER_DAY;
const THREE_DAYS = THREE * SECONDS_PER_DAY;
const FIVE = 5;
const MILLISECONDS_PER_MINUTE = 60_000;
const FIVE_MINUTES_MS = FIVE * MILLISECONDS_PER_MINUTE;
const NOW_MS = new Date('2026-01-01T00:00:00Z').getTime();
const NOW_SECONDS = NOW_MS / MILLISECONDS_PER_SECOND;

function createToken(payload: {sub?: string; isGuest?: boolean; exp?: number}): string {
  return new UnsecuredJWT(payload).encode();
}
