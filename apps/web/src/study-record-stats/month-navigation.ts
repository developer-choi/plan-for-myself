import {type CalendarMonth, isFutureMonth, isPastMonth, shiftMonth} from '@/study-record/calendar-date';

interface StatsMonthParams {
  today: string;
  month: CalendarMonth;
  /* 기록이 하나도 없으면 null */
  firstRecordDate: string | null;
}

interface StatsMonthNavigation {
  /* 첫 기록이 있는 달이거나 기록이 하나도 없으면 비운다 */
  previous?: CalendarMonth;
  /* 이번 달이거나 기록이 하나도 없으면 비운다 */
  next?: CalendarMonth;
}

export function getStatsMonthNavigation({today, month, firstRecordDate}: StatsMonthParams): StatsMonthNavigation {
  if (firstRecordDate === null) {
    return {};
  }

  const previous = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  const canGoPrevious = !isPastMonth(firstRecordDate, previous);
  const canGoNext = !isFutureMonth(today, next);

  return {
    previous: canGoPrevious ? previous : undefined,
    next: canGoNext ? next : undefined,
  };
}

/* 첫 기록 앞 달은 기록한 날 분모가 그 달을 다 세어 사실과 다른 숫자가 나오므로 통계를 보이지 않는다 */
export function isBeforeFirstRecord(month: CalendarMonth, firstRecordDate: string | null): boolean {
  return firstRecordDate === null || isPastMonth(firstRecordDate, month);
}
