import {describe, expect, it} from 'vitest';
import {GUEST_LIMIT_CODE, hasGuestLimitCode} from './guest-limit';

describe('hasGuestLimitCode()', () => {
  describe('General cases', () => {
    it('code가 게스트 한도 코드면 true를 반환해야 한다', () => {
      expect(hasGuestLimitCode({code: GUEST_LIMIT_CODE})).toBe(true);
    });
  });

  describe('Boundary cases', () => {
    [
      {errorData: {code: 'other'}, reason: 'code가 다른 값'},
      {errorData: {}, reason: 'code가 없는 객체'},
      {errorData: null, reason: 'null'},
      {errorData: undefined, reason: 'undefined'},
      {errorData: 'guest_limit', reason: '객체가 아닌 문자열'},
    ].forEach(({errorData, reason}) => {
      it(`${reason}이면 false를 반환해야 한다`, () => {
        expect(hasGuestLimitCode(errorData)).toBe(false);
      });
    });
  });
});
