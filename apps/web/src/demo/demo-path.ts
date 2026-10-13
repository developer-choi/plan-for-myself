import type {CalendarMonth} from '@/study-record/calendar-date';

export function demoCalendarPath({year, month}: CalendarMonth) {
  return `/demo/study-records/${year}/${month}`;
}

export function demoStatsPath({year, month}: CalendarMonth) {
  return `/demo/study-record-stats/${year}/${month}`;
}

/* 예시의 이번 달은 실제 날짜로 정해지므로, 들어가는 주소는 달을 박지 않고 그 페이지가 이번 달로 보낸다 */
export const DEMO_HOME_URL = '/demo/study-records';
