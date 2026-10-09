import {type CalendarMonth, isFutureMonth, isPastMonth, isSameMonth} from '@/study-record/calendar-date';

interface CalendarSummaryParams {
  today: string;
  month: CalendarMonth;
  streak: number;
  firstRecordDate: string;
}

export interface CalendarSummaryContent {
  /* [통계]를 숨기는 달(미래 달, 첫 기록 달보다 앞선 달)이면 비운다 */
  statsHref?: string;
  /* 연속 기록을 숨기는 달(이번 달이 아니거나 연속 1일 이하)이면 비운다 */
  streak?: number;
}

export function getCalendarSummaryContent({
  today,
  month,
  streak,
  firstRecordDate,
}: CalendarSummaryParams): CalendarSummaryContent {
  if (isFutureMonth(today, month) || isPastMonth(firstRecordDate, month)) {
    return {};
  }

  const statsHref = statsPath(month);
  const showsStreak = isSameMonth(today, month) && streak >= MIN_STREAK_DAYS;

  return showsStreak ? {statsHref, streak} : {statsHref};
}

export const MIN_STREAK_DAYS = 2;

function statsPath({year, month}: CalendarMonth) {
  return `/study-record-stats/${year}/${month}`;
}
