import {describe, expect, it} from 'vitest';
import {getKoreanToday} from './korean';

describe('getKoreanToday()', () => {
  describe('Boundary cases', () => {
    it('UTC로는 전날 15시 30분이어도 한국 날짜 기준 다음 날을 반환해야 한다', () => {
      expect(getKoreanToday(new Date('2026-09-30T15:30:00Z'))).toBe('2026-10-01');
    });

    it('UTC로는 12월 31일이어도 한국 날짜 기준 다음 해 1월 1일을 반환해야 한다', () => {
      expect(getKoreanToday(new Date('2026-12-31T15:00:00Z'))).toBe('2027-01-01');
    });

    it('한국 시각으로 자정 직전이면 그날을 반환해야 한다', () => {
      expect(getKoreanToday(new Date('2026-09-30T14:59:59Z'))).toBe('2026-09-30');
    });
  });

  describe('General cases', () => {
    it('한 자리 월·일도 두 자리로 채운 YYYY-MM-DD를 반환해야 한다', () => {
      expect(getKoreanToday(new Date('2026-03-05T03:00:00Z'))).toBe('2026-03-05');
    });
  });
});
