import {type CalendarMonth, type GetDemoApiResponse, isBeforeFirstRecord, isFutureMonth} from '@plan-for-myself/shared';
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
