import {afterEach, describe, expect, it, vi} from 'vitest';
import {getDemoToday} from './demo-today';

describe('getDemoToday', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('General cases', () => {
    [
      {name: '31일 달', now: '2026-10-12T12:00:00+09:00', expected: '2026-10-31'},
      {name: '30일 달', now: '2026-04-03T12:00:00+09:00', expected: '2026-04-30'},
      {name: '평년 2월', now: '2026-02-10T12:00:00+09:00', expected: '2026-02-28'},
      {name: '윤년 2월', now: '2028-02-10T12:00:00+09:00', expected: '2028-02-29'},
    ].forEach(({name, now, expected}) => {
      it(`${name}이면 그 달 마지막 날이다`, () => {
        expect(getDemoToday(new Date(now))).toBe(expected);
      });
    });

    it('부를 때마다 그때의 이번 달로 계산한다', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-31T23:00:00+09:00'));
      expect(getDemoToday()).toBe('2026-10-31');

      vi.setSystemTime(new Date('2026-11-01T00:30:00+09:00'));
      expect(getDemoToday()).toBe('2026-11-30');
    });
  });

  describe('Edge cases', () => {
    it('UTC로는 아직 지난달이어도 한국 시간 기준 이번 달이다', () => {
      const now = new Date('2026-10-31T16:00:00Z');

      expect(getDemoToday(now)).toBe('2026-11-30');
    });
  });
});
