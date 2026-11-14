import {describe, expect, it} from 'vitest';
import {readLoginReason, toLoginUrl} from '@/auth/redirect';

describe('toLoginUrl()', () => {
  describe('General cases', () => {
    it('이유가 없으면 돌아올 경로만 담은 로그인 주소를 반환해야 한다', () => {
      const path = '/study-records?month=2026-09';

      expect(toLoginUrl(path)).toBe(`/login?redirect=${encodeURIComponent(path)}`);
    });

    it('세션이 풀린 이유면 reason을 붙인 로그인 주소를 반환해야 한다', () => {
      const path = '/study-records';
      const reason = 'signed-out';

      expect(toLoginUrl(path, reason)).toBe(`/login?redirect=${encodeURIComponent(path)}&reason=${reason}`);
    });
  });
});

describe('readLoginReason()', () => {
  describe('General cases', () => {
    it('signed-out이면 signed-out을 반환해야 한다', () => {
      const reason = 'signed-out';

      expect(readLoginReason(reason)).toBe(reason);
    });
  });

  describe('Edge cases', () => {
    it('같은 이름의 파라미터가 여럿이면 첫 값을 읽어야 한다', () => {
      const reason = 'signed-out';

      expect(readLoginReason([reason, 'other'])).toBe(reason);
    });

    [
      {value: undefined, reason: '파라미터가 없으면'},
      {value: 'expired', reason: '알 수 없는 값이면'},
    ].forEach(({value, reason}) => {
      it(`${reason} null을 반환해야 한다`, () => {
        expect(readLoginReason(value)).toBeNull();
      });
    });
  });
});
