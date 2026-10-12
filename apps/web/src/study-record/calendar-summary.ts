import {type CalendarMonth, isFutureMonth, isPastMonth} from '@/study-record/calendar-date';

interface CalendarSummaryParams {
  today: string;
  month: CalendarMonth;
  firstRecordDate: string;
  statsHref: string;
}

export interface CalendarSummaryContent {
  /* [통계]를 숨기는 달(미래 달, 첫 기록 달보다 앞선 달)이면 비운다 */
  statsHref?: string;
}

export function getCalendarSummaryContent({
  today,
  month,
  firstRecordDate,
  statsHref,
}: CalendarSummaryParams): CalendarSummaryContent {
  if (isFutureMonth(today, month) || isPastMonth(firstRecordDate, month)) {
    return {};
  }

  return {statsHref};
}
