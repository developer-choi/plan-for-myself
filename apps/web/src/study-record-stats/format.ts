import type {StudyRecordOverview} from '@plan-for-myself/shared';
import type {CalendarMonth} from '@/study-record/calendar-date';
import {MIN_STREAK_DAYS} from '@/study-record/calendar-summary';

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const restMinutes = minutes % MINUTES_PER_HOUR;

  if (hours >= HOURS_WITHOUT_MINUTES) {
    return `${hours.toLocaleString('ko-KR')}시간`;
  }
  if (hours === 0) {
    return `${restMinutes}분`;
  }
  return restMinutes === 0 ? `${hours}시간` : `${hours}시간 ${restMinutes}분`;
}

export function formatMinutesDiff(minutes: number): string {
  const sign = minutes >= 0 ? '+' : MINUS_SIGN;
  return `${sign}${formatDuration(Math.abs(minutes))}`;
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
const HOURS_WITHOUT_MINUTES = 100;
