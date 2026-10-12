import {describe, expect, it} from 'vitest';
import {statsPath} from './calendar-date';
import {getCalendarSummaryContent} from './calendar-summary';

describe('getCalendarSummaryContent()', () => {
  const today = '2026-09-24';
  const firstRecordDate = '2025-01-01';

  describe('General cases', () => {
    it('이번 달이면 통계 버튼을 보여줘야 한다', () => {
      const month = {year: 2026, month: 9};

      expect(
        getCalendarSummaryContent({
          today,
          month,
          firstRecordDate,
          statsHref: statsPath(month),
        }),
      ).toEqual({statsHref: '/study-record-stats/2026/9'});
    });

    it('지난 달이면 통계 버튼을 보여줘야 한다', () => {
      const month = {year: 2026, month: 8};

      expect(
        getCalendarSummaryContent({
          today,
          month,
          firstRecordDate,
          statsHref: statsPath(month),
        }),
      ).toEqual({statsHref: '/study-record-stats/2026/8'});
    });

    it('미래 달이면 아무것도 보여주지 않아야 한다', () => {
      const month = {year: 2026, month: 10};

      expect(
        getCalendarSummaryContent({
          today,
          month,
          firstRecordDate,
          statsHref: statsPath(month),
        }),
      ).toEqual({});
    });
  });

  describe('Boundary cases', () => {
    const month = {year: 2026, month: 9};
    const statsHref = statsPath(month);

    describe('첫 기록이 있는 달 근처', () => {
      const firstRecordDateInSeptember = '2026-09-10';

      it('첫 기록보다 앞선 달이면 아무것도 보여주지 않아야 한다', () => {
        const month = {year: 2026, month: 8};

        expect(
          getCalendarSummaryContent({
            today,
            month,
            firstRecordDate: firstRecordDateInSeptember,
            statsHref: statsPath(month),
          }),
        ).toEqual({});
      });

      it('첫 기록이 있는 달이면 통계 버튼을 보여줘야 한다', () => {
        expect(
          getCalendarSummaryContent({today, month, firstRecordDate: firstRecordDateInSeptember, statsHref}),
        ).toMatchObject({statsHref});
      });
    });

    describe('해가 바뀐 1월에 보면', () => {
      const newYearToday = '2026-01-05';

      it('전해 12월은 지난 달처럼 통계 버튼을 보여줘야 한다', () => {
        const month = {year: 2025, month: 12};

        expect(
          getCalendarSummaryContent({
            today: newYearToday,
            month,
            firstRecordDate,
            statsHref: statsPath(month),
          }),
        ).toEqual({statsHref: '/study-record-stats/2025/12'});
      });

      it('다음 해 1월은 미래 달처럼 아무것도 보여주지 않아야 한다', () => {
        const month = {year: 2027, month: 1};

        expect(
          getCalendarSummaryContent({
            today: newYearToday,
            month,
            firstRecordDate,
            statsHref: statsPath(month),
          }),
        ).toEqual({});
      });
    });
  });
});
