import {describe, expect, it} from 'vitest';
import {getCalendarSummaryContent} from './calendar-summary';

describe('getCalendarSummaryContent()', () => {
  const today = '2026-09-24';
  const streak = 5;
  const firstRecordDate = '2025-01-01';

  describe('General cases', () => {
    it('이번 달이면 통계 버튼과 함께 연속 기록도 보여줘야 한다', () => {
      expect(getCalendarSummaryContent({today, month: {year: 2026, month: 9}, streak, firstRecordDate})).toEqual({
        statsHref: '/study-record-stats/2026/9',
        streak,
      });
    });

    it('지난 달이면 통계 버튼만 보여줘야 한다', () => {
      expect(getCalendarSummaryContent({today, month: {year: 2026, month: 8}, streak, firstRecordDate})).toEqual({
        statsHref: '/study-record-stats/2026/8',
      });
    });

    it('미래 달이면 아무것도 보여주지 않아야 한다', () => {
      expect(getCalendarSummaryContent({today, month: {year: 2026, month: 10}, streak, firstRecordDate})).toEqual({});
    });
  });

  describe('Boundary cases', () => {
    const month = {year: 2026, month: 9};
    const statsHref = '/study-record-stats/2026/9';

    describe('이번 달일 때', () => {
      [
        {streak: 1, expected: {statsHref}, name: '연속 1일이면 연속 기록을 보여주지 않아야 한다'},
        {streak: 2, expected: {statsHref, streak: 2}, name: '연속 2일부터 연속 기록을 보여줘야 한다'},
      ].forEach(({streak: currentStreak, expected, name}) => {
        it(name, () => {
          expect(getCalendarSummaryContent({today, month, streak: currentStreak, firstRecordDate})).toEqual(expected);
        });
      });
    });

    describe('첫 기록이 있는 달 근처', () => {
      const firstRecordDateInSeptember = '2026-09-10';

      it('첫 기록보다 앞선 달이면 아무것도 보여주지 않아야 한다', () => {
        expect(
          getCalendarSummaryContent({
            today,
            month: {year: 2026, month: 8},
            streak,
            firstRecordDate: firstRecordDateInSeptember,
          }),
        ).toEqual({});
      });

      it('첫 기록이 있는 달이면 통계 버튼을 보여줘야 한다', () => {
        expect(
          getCalendarSummaryContent({today, month, streak, firstRecordDate: firstRecordDateInSeptember}),
        ).toMatchObject({statsHref});
      });
    });

    describe('해가 바뀐 1월에 보면', () => {
      const newYearToday = '2026-01-05';

      it('전해 12월은 지난 달처럼 통계 버튼만 보여줘야 한다', () => {
        expect(
          getCalendarSummaryContent({today: newYearToday, month: {year: 2025, month: 12}, streak, firstRecordDate}),
        ).toEqual({
          statsHref: '/study-record-stats/2025/12',
        });
      });

      it('다음 해 1월은 미래 달처럼 아무것도 보여주지 않아야 한다', () => {
        expect(
          getCalendarSummaryContent({today: newYearToday, month: {year: 2027, month: 1}, streak, firstRecordDate}),
        ).toEqual({});
      });
    });
  });
});
