import {FAILURE_TAG_TREND_MONTH_LIMIT} from '@plan-for-myself/shared';
import {describe, expect, it} from 'vitest';
import {type CalendarMonth, isSameMonth, shiftMonth} from '@/study-record/calendar-date';
import {getDemoMonth, getDemoMonthly, getDemoOverview, getDemoRecords, getDemoToday} from './demo-examples';

describe('예시 기록', () => {
  describe('General cases', () => {
    [
      {name: '31일 달', nowText: '2026-10-12T12:00:00+09:00'},
      {name: '30일 달', nowText: '2026-04-03T12:00:00+09:00'},
      {name: '평년 2월', nowText: '2026-02-10T12:00:00+09:00'},
      {name: '윤년 2월', nowText: '2028-02-10T12:00:00+09:00'},
    ].forEach(({name, nowText}) => {
      describe(name, () => {
        const now = new Date(nowText);
        const thisMonth = getDemoMonth(now);
        const records = getDemoRecords(now);

        it('최근 6개월 각 달에 기록이 있다', () => {
          const recentMonths = listRecentMonths(thisMonth);

          recentMonths.forEach((month) => {
            expect(records.some((record) => isSameMonth(record.date, month))).toBe(true);
          });
        });

        it('그보다 앞 달과 미래 달에는 기록이 없다', () => {
          const recentMonths = listRecentMonths(thisMonth);

          expect(records.every((record) => recentMonths.some((month) => isSameMonth(record.date, month)))).toBe(true);
        });

        it('모든 기록 날짜가 실제로 있는 날이다', () => {
          records.forEach((record) => {
            expect(new Date(`${record.date}T00:00:00Z`).toISOString()).toBe(`${record.date}T00:00:00.000Z`);
          });
        });

        it('이번 달 말일까지 연속 기록이 이어진다', () => {
          expect(records.some((record) => record.date === getDemoToday(now))).toBe(true);
          expect(getDemoOverview(now).streak.current).toBe(STREAK_AT_END_OF_MONTH);
        });

        it('이번 달에 지난달보다 줄어든 실패 태그가 있다', () => {
          const {failureTags} = getDemoMonthly(thisMonth, now);

          expect(failureTags.some((tag) => tag.status === 'reduced')).toBe(true);
        });
      });
    });
  });
});

const STREAK_AT_END_OF_MONTH = 14;

function listRecentMonths(thisMonth: CalendarMonth) {
  return Array.from({length: FAILURE_TAG_TREND_MONTH_LIMIT}, (_value, index) => shiftMonth(thisMonth, -index));
}
