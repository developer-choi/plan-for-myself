import {describe, expect, it} from 'vitest';
import {toMonthParam} from './month-param';

describe('toMonthParam()', () => {
  describe('General cases', () => {
    it('한 자리 달도 두 자리로 채운 YYYY-MM을 반환해야 한다', () => {
      expect(toMonthParam({year: 2026, month: 9})).toBe('2026-09');
    });

    it('두 자리 달은 그대로 YYYY-MM을 반환해야 한다', () => {
      expect(toMonthParam({year: 2026, month: 10})).toBe('2026-10');
    });
  });
});
