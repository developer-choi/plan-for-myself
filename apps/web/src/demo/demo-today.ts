import {getKoreanDate} from '@plan-for-myself/shared';
import type {CalendarMonth} from '@/study-record/calendar-date';

/*
 * 예시는 실제 이번 달을 그리고, 그 달 마지막 날을 「오늘」로 둔다 — 달력(오늘 뒤 칸의 기록도 그린다)과 통계(오늘까지만 센다)가 같은 한 달을 보게.
 * 서버가 뜬 달에 멈추지 않도록 상수로 두지 않고 부를 때마다 계산한다
 */
export function getDemoMonth(now = new Date()): CalendarMonth {
  const {year, month: monthIndex} = getKoreanDate(now);
  return {year, month: monthIndex + 1};
}

export function getDemoToday(now = new Date()): string {
  const {year, month} = getDemoMonth(now);
  return toDateString({year, month}, getLastDayOfMonth({year, month}));
}

export function getLastDayOfMonth({year, month}: CalendarMonth) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function toDateString({year, month}: CalendarMonth, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
