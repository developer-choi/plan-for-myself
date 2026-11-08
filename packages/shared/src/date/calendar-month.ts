export interface CalendarMonth {
  year: number;
  month: number;
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

export function monthPath({year, month}: CalendarMonth): `/study-records/${number}/${number}` {
  return `/study-records/${year}/${month}`;
}

export function formatMonthTitle({year, month}: CalendarMonth): string {
  return `${year}년 ${month}월`;
}

const YEAR_PATTERN = /^[1-9]\d{3}$/;
const MAX_YEAR = 9998;
const MONTH_PATTERN = /^(?:[1-9]|1[0-2])$/;
