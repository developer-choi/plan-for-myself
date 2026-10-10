import {minutesFormat, type StudyRecordOverview} from '@plan-for-myself/shared';
import type {CalendarMonth} from '@/study-record/calendar-date';
import {MIN_STREAK_DAYS} from '@/study-record/calendar-summary';

export function formatMinutesDiff(minutes: number): string {
  const sign = minutes >= 0 ? '+' : MINUS_SIGN;
  return `${sign}${minutesFormat(Math.abs(minutes))}`;
}

export function minutesToHours(minutes: number): number {
  return Math.floor(minutes / MINUTES_PER_HOUR);
}

export function formatHours(minutes: number): string {
  return minutesToHours(minutes).toLocaleString('ko-KR');
}

export function formatStreakNote({current, longest}: StudyRecordOverview['streak']): string {
  const isBreakingRecord = current >= MIN_STREAK_DAYS && current === longest;
  return isBreakingRecord ? '최고 기록 경신 중' : `역대 최장 ${longest}일`;
}

export function formatMonthLabel(month: string): string {
  const [, monthNumber] = month.split('-');
  return `${Number(monthNumber)}월`;
}

export function formatStatsTitle({year, month}: CalendarMonth): string {
  return `${year}년 ${month}월 통계`;
}

const MINUS_SIGN = '−';
const MINUTES_PER_HOUR = 60;
