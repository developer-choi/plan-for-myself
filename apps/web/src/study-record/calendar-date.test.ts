import {describe, expect, it} from 'vitest';
import {formatDateTitle, isSameMonth} from './calendar-date';

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

describe('formatDateTitle()', () => {
  describe('General cases', () => {
    it('날짜를 넘기면 월·일·요일 제목을 반환해야 한다', () => {
      expect(formatDateTitle('2026-10-07')).toBe('10월 7일 (수)');
    });
  });

  describe('Boundary cases', () => {
    it('한 자리 월·일이면 앞의 0을 뗀 제목을 반환해야 한다', () => {
      expect(formatDateTitle('2026-01-05')).toBe('1월 5일 (월)');
    });

    it('일요일이면 요일 자리에 「일」을 반환해야 한다', () => {
      expect(formatDateTitle('2026-10-11')).toBe('10월 11일 (일)');
    });
  });
});
