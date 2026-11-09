import {type CalendarMonth, toDateMonthParam, toMonthParam} from '@plan-for-myself/shared';

export function statsPath({year, month}: CalendarMonth) {
  return `/study-record-stats/${year}/${month}`;
}

export function isSameMonth(date: string, month: CalendarMonth): boolean {
  return date.startsWith(toMonthParam(month));
}

export function isFutureMonth(today: string, month: CalendarMonth): boolean {
  return toMonthParam(month) > toDateMonthParam(today);
}

export function isPastMonth(date: string, month: CalendarMonth): boolean {
  return toMonthParam(month) < toDateMonthParam(date);
}
