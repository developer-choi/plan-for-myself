import type {CalendarMonth} from '../date/calendar-month';
import {isFutureMonth, isPastMonth} from './calendar-date';

interface CalendarSummaryParams<Href extends string> {
  today: string;
  month: CalendarMonth;
  firstRecordDate: string;
  statsHref: Href;
}

export interface CalendarSummaryContent<Href extends string = string> {
  /* [통계]를 숨기는 달(미래 달, 첫 기록 달보다 앞선 달)이면 비운다 */
  statsHref?: Href;
}

export function getCalendarSummaryContent<Href extends string>({
  today,
  month,
  firstRecordDate,
  statsHref,
}: CalendarSummaryParams<Href>): CalendarSummaryContent<Href> {
  if (isFutureMonth(today, month) || isPastMonth(firstRecordDate, month)) {
    return {};
  }

  return {statsHref};
}
