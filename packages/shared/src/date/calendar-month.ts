export interface CalendarMonth {
  year: number;
  month: number;
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

export function shiftMonth({year, month}: CalendarMonth, offset: number): CalendarMonth {
  const date = new Date(year, month - 1 + offset, 1);
  return {year: date.getFullYear(), month: date.getMonth() + 1};
}

/* 연이 1000~9998의 네 자리, 월이 앞에 0 없는 1~12가 아니면 null */
export function parseMonth({year, month}: {year: string; month: string}): CalendarMonth | null {
  if (!YEAR_PATTERN.test(year) || Number(year) > MAX_YEAR || !MONTH_PATTERN.test(month)) {
    return null;
  }

  return {year: Number(year), month: Number(month)};
}

export function formatMonthTitle({year, month}: CalendarMonth): string {
  return `${year}년 ${month}월`;
}

export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;

const DAYS_PER_WEEK = 7;
const YEAR_PATTERN = /^[1-9]\d{3}$/;
const MAX_YEAR = 9998;
const MONTH_PATTERN = /^(?:[1-9]|1[0-2])$/;

function pad(value: number) {
  return String(value).padStart(2, '0');
}
