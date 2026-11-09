import {describe, expect, it} from 'vitest';
import {isSameMonth} from './calendar-date';

describe('isSameMonth()', () => {
  describe('General cases', () => {
    it('날짜의 연·월이 보고 있는 달과 같으면 true여야 한다', () => {
      expect(isSameMonth('2026-10-04', {year: 2026, month: 10})).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('달은 같아도 해가 다르면 false여야 한다', () => {
      expect(isSameMonth('2025-10-04', {year: 2026, month: 10})).toBe(false);
    });

    it('해는 같아도 달이 다르면 false여야 한다', () => {
      expect(isSameMonth('2026-09-30', {year: 2026, month: 10})).toBe(false);
    });
  });
});
