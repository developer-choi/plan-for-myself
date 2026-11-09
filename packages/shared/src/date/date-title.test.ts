import {describe, expect, it} from 'vitest';
import {formatDateTitle} from './date-title';

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
