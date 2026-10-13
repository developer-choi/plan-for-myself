export interface CalendarMonth {
  year: number;
  month: number;
}

export function shiftMonth({year, month}: CalendarMonth, offset: number): CalendarMonth {
  const date = new Date(year, month - 1 + offset, 1);
  return {year: date.getFullYear(), month: date.getMonth() + 1};
}

export function parseMonth({year, month}: {year: string; month: string}): CalendarMonth | null {
  if (!YEAR_PATTERN.test(year) || Number(year) > MAX_YEAR || !MONTH_PATTERN.test(month)) {
    return null;
  }

  return {year: Number(year), month: Number(month)};
}

export function monthPath({year, month}: CalendarMonth) {
  return `/study-records/${year}/${month}`;
}

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

export function toDateMonthParam(date: string): string {
  return date.slice(0, MONTH_PARAM_LENGTH);
}

export function formatMonthTitle({year, month}: CalendarMonth): string {
  return `${year}년 ${month}월`;
}

export function formatDateTitle(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${month}월 ${day}일 (${DAY_NAMES[new Date(year, month - 1, day).getDay()]})`;
}

const DAYS_PER_WEEK = 7;
export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;
const MONTH_PARAM_LENGTH = 'YYYY-MM'.length;
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;
const YEAR_PATTERN = /^[1-9]\d{3}$/;
const MAX_YEAR = 9998;
const MONTH_PATTERN = /^(?:[1-9]|1[0-2])$/;

function pad(value: number) {
  return String(value).padStart(2, '0');
}
