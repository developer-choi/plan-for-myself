import type {CalendarMonth} from '@plan-for-myself/shared/date';
import {isFutureMonth} from '@plan-for-myself/shared/study-record';
import {isBeforeFirstRecord} from '@plan-for-myself/shared/study-record-stats';
import {getDemoMonthly, getDemoOverview, getDemoRecords} from './demo-examples';
import {getDemoMonth, getDemoToday} from './demo-today';
import type {GetDemoApiResponse} from './type';

export function isDemoStatsMonth(month: CalendarMonth, today: string, firstRecordDate: string | null): boolean {
  return !isFutureMonth(today, month) && !isBeforeFirstRecord(month, firstRecordDate);
}

export function getDemoResponse(month: CalendarMonth | null, now = new Date()): GetDemoApiResponse {
  const viewMonth = month ?? getDemoMonth(now);
  const today = getDemoToday(now);
  const overview = getDemoOverview(now);

  return {
    today,
    records: getDemoRecords(now),
    overview,
    monthly: isDemoStatsMonth(viewMonth, today, overview.firstRecordDate) ? getDemoMonthly(viewMonth, now) : null,
  };
}
