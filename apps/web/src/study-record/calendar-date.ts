import {type CalendarMonth, toDateMonthParam} from '@plan-for-myself/shared';

export function statsPath({year, month}: CalendarMonth) {
  return `/study-record-stats/${year}/${month}`;
}

export interface CalendarCell {
  date: string;
  day: number;
  inMonth: boolean;
}

export function getCalendarCells({year, month}: CalendarMonth): CalendarCell[] {
  const leadingDays = (new Date(year, month - 1, 1).getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks = Math.ceil((leadingDays + daysInMonth) / DAYS_PER_WEEK);

  return Array.from({length: weeks * DAYS_PER_WEEK}, (_cell, index) => {
    const cellDate = new Date(year, month - 1, 1 - leadingDays + index);
    const cellMonth = cellDate.getMonth() + 1;

    return {
      date: `${cellDate.getFullYear()}-${pad(cellMonth)}-${pad(cellDate.getDate())}`,
      day: cellDate.getDate(),
      inMonth: cellMonth === month,
    };
  });
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

export function toMonthParam({year, month}: CalendarMonth): string {
  return `${year}-${pad(month)}`;
}

export function formatDateTitle(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${month}월 ${day}일 (${DAY_NAMES[new Date(year, month - 1, day).getDay()]})`;
}

const DAYS_PER_WEEK = 7;
export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

function pad(value: number) {
  return String(value).padStart(2, '0');
}
