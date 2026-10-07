import {type CalendarMonth, isSameMonth, toMonthParam} from '@/study-record/calendar-date';

interface CalendarSummaryParams {
  today: string;
  month: CalendarMonth;
  streak: number;
}

export interface CalendarSummaryContent {
  /* [통계]를 숨기는 달(미래 달)이면 비운다 */
  statsHref?: string;
  /* 연속 기록을 숨기는 달(이번 달이 아니거나 연속 1일 이하)이면 비운다 */
  streak?: number;
}

export function getCalendarSummaryContent({today, month, streak}: CalendarSummaryParams): CalendarSummaryContent {
  const isFutureMonth = toMonthParam(month) > toMonthParamOfDate(today);

  if (isFutureMonth) {
    return {};
  }

  const statsHref = statsPath(month);
  const showsStreak = isSameMonth(today, month) && streak >= MIN_STREAK_DAYS;

  return showsStreak ? {statsHref, streak} : {statsHref};
}

export const MIN_STREAK_DAYS = 2;
const MONTH_PARAM_LENGTH = 'YYYY-MM'.length;

function statsPath({year, month}: CalendarMonth) {
  return `/study-record-stats/${year}/${month}`;
}

function toMonthParamOfDate(date: string) {
  return date.slice(0, MONTH_PARAM_LENGTH);
}
