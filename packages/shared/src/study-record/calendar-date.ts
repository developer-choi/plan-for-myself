import type {CalendarMonth} from '../date/calendar-month';
import {toDateMonthParam, toMonthParam} from '../date/month-param';
import type {StudyRecord} from './type';

export function monthPath({year, month}: CalendarMonth): `/study-records/${number}/${number}` {
  return `/study-records/${year}/${month}`;
}

export function statsPath({year, month}: CalendarMonth): `/study-record-stats/${number}/${number}` {
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

export function findFirstRecordDateOfMonth(
  records: Pick<StudyRecord, 'date'>[],
  month: CalendarMonth,
): string | undefined {
  return records.find((record) => isSameMonth(record.date, month))?.date;
}
