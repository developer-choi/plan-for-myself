import type {CalendarMonth} from '@plan-for-myself/shared/date';
import type {GetDemoApiResponse} from '@plan-for-myself/shared/demo';
import {isBeforeFirstRecord} from '@plan-for-myself/shared/study-record-stats';
import {isFutureMonth} from '@plan-for-myself/shared/study-record';
import {getDemoMonth, getDemoMonthly, getDemoOverview, getDemoRecords, getDemoToday} from '@/demo/demo-examples';

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
