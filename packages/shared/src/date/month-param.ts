import type {CalendarMonth} from './calendar-month';

export function toDateMonthParam(date: string): string {
  return date.slice(0, MONTH_PARAM_LENGTH);
}

export function toMonthParam({year, month}: CalendarMonth): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

const MONTH_PARAM_LENGTH = 'YYYY-MM'.length;
