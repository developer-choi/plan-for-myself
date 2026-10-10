import type {CalendarMonth} from '@/study-record/calendar-date';

export function demoCalendarPath({year, month}: CalendarMonth) {
  return `/demo/study-records/${year}/${month}`;
}

export function demoStatsPath({year, month}: CalendarMonth) {
  return `/demo/study-record-stats/${year}/${month}`;
}
