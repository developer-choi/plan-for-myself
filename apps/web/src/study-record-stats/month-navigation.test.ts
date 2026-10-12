import {describe, expect, it} from 'vitest';
import {getStatsMonthNavigation, isBeforeFirstRecord} from './month-navigation';

describe('getStatsMonthNavigation()', () => {
  const today = '2026-10-12';
  const firstRecordDate = '2026-07-15';

  describe('General cases', () => {
    it('첫 기록 달과 이번 달 사이면 이전·다음 달 둘 다 있어야 한다', () => {
      expect(getStatsMonthNavigation({today, month: {year: 2026, month: 8}, firstRecordDate})).toEqual({
        previous: {year: 2026, month: 7},
        next: {year: 2026, month: 9},
      });
    });

    it('이번 달이면 다음 달이 없어야 한다', () => {
      expect(getStatsMonthNavigation({today, month: {year: 2026, month: 10}, firstRecordDate})).toEqual({
        previous: {year: 2026, month: 9},
      });
    });

    it('첫 기록이 있는 달이면 이전 달이 없어야 한다', () => {
      expect(getStatsMonthNavigation({today, month: {year: 2026, month: 7}, firstRecordDate})).toEqual({
        next: {year: 2026, month: 8},
      });
    });
  });

  describe('Edge cases', () => {
    it('기록이 하나도 없으면 이전·다음 달 둘 다 없어야 한다', () => {
      expect(getStatsMonthNavigation({today, month: {year: 2026, month: 10}, firstRecordDate: null})).toEqual({});
    });

    it('첫 기록이 이번 달이면 이전·다음 달 둘 다 없어야 한다', () => {
      expect(getStatsMonthNavigation({today, month: {year: 2026, month: 10}, firstRecordDate: '2026-10-03'})).toEqual(
        {},
      );
    });

    it('해가 바뀌어도 이전 달이 전해 12월이어야 한다', () => {
      expect(
        getStatsMonthNavigation({today: '2026-01-05', month: {year: 2026, month: 1}, firstRecordDate: '2025-11-02'}),
      ).toEqual({previous: {year: 2025, month: 12}});
    });
  });
});

describe('isBeforeFirstRecord()', () => {
  const firstRecordDate = '2026-07-15';

  it('첫 기록 달보다 앞선 달이면 true여야 한다', () => {
    expect(isBeforeFirstRecord({year: 2026, month: 6}, firstRecordDate)).toBe(true);
  });

  it('첫 기록이 있는 달이면 false여야 한다', () => {
    expect(isBeforeFirstRecord({year: 2026, month: 7}, firstRecordDate)).toBe(false);
  });

  it('기록이 하나도 없으면 어느 달이든 true여야 한다', () => {
    expect(isBeforeFirstRecord({year: 2026, month: 10}, null)).toBe(true);
  });
});
