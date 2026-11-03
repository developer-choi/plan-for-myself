import {describe, expect, it} from 'vitest';
import {GUEST_LIMIT_CODE, hasGuestLimitCode} from './guest-limit';

describe('hasGuestLimitCode()', () => {
  describe('General cases', () => {
    it('code가 게스트 한도 코드면 true를 반환해야 한다', () => {
      expect(hasGuestLimitCode({code: GUEST_LIMIT_CODE})).toBe(true);
    });
  });

  describe('Boundary cases', () => {
    it.for([{code: 'other'}, {}, null, undefined, 'guest_limit'])('%j이면 false를 반환해야 한다', (errorData) => {
      expect(hasGuestLimitCode(errorData)).toBe(false);
    });
  });
});
