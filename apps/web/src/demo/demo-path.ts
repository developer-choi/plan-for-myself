import {DEMO_MONTH} from '@/demo/demo-today';
import type {CalendarMonth} from '@/study-record/calendar-date';

export function demoCalendarPath({year, month}: CalendarMonth) {
  return `/demo/study-records/${year}/${month}`;
}

export function demoStatsPath({year, month}: CalendarMonth) {
  return `/demo/study-record-stats/${year}/${month}`;
}

export function isDemoPath(pathname: string) {
  return pathname.startsWith('/demo/');
}

export const DEMO_HOME_URL = demoCalendarPath(DEMO_MONTH);
