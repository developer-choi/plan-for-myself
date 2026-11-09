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

export function formatDateTitle(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${month}월 ${day}일 (${DAY_NAMES[new Date(year, month - 1, day).getDay()]})`;
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;
