import type {CalendarMonth} from './calendar-month';
import type {SimpleDate} from './lunar';

export function parseDateParam(date: string): SimpleDate {
  const [year = 0, month = 0, day = 0] = date.split('-').map(Number);
  return {year, month, date: day};
}

export function toDateMonthParam(date: string): string {
  return date.slice(0, MONTH_PARAM_LENGTH);
}

export function toMonthParam({year, month}: CalendarMonth): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

const MONTH_PARAM_LENGTH = 'YYYY-MM'.length;
