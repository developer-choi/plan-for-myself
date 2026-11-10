import {describe, expect, it} from 'vitest';
import {isFutureMonth, isSameMonth} from './calendar-date';

describe('isSameMonth()', () => {
  describe('General cases', () => {
    it('날짜의 연·월이 보고 있는 달과 같으면 true여야 한다', () => {
      expect(isSameMonth('2026-10-04', {year: 2026, month: 10})).toBe(true);
    });
  });

  describe('Edge cases', () => {
    describe('달이 같을 때', () => {
      it('해가 다르면 false여야 한다', () => {
        expect(isSameMonth('2025-10-04', {year: 2026, month: 10})).toBe(false);
      });
    });

    describe('해가 같을 때', () => {
      it('달이 다르면 false여야 한다', () => {
        expect(isSameMonth('2026-09-30', {year: 2026, month: 10})).toBe(false);
      });
    });
  });
});

describe('isFutureMonth()', () => {
  describe('General cases', () => {
    it('보는 달이 오늘보다 뒤면 true여야 한다', () => {
      expect(isFutureMonth('2026-10-29', {year: 2026, month: 11})).toBe(true);
    });

    it('보는 달이 오늘과 같은 달이면 false여야 한다', () => {
      expect(isFutureMonth('2026-10-29', {year: 2026, month: 10})).toBe(false);
    });
  });
});
