import {arraySplit} from '@/util/extend/data-type/array';

export interface MonthBoundary {
  startOfMonth: Date;  // 해당 월의 첫 번째 일의 Date 객체
  endOfMonth: Date;    // 해당 월의 마지막 일의 Date 객체
}

export function getMonthBoundary(year: number, month: number): MonthBoundary {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  return {
    startOfMonth,
    endOfMonth,
  };
}

export type CalendarBoundary = MonthBoundary;

export function getCalendarBoundary(year: number, month: number): CalendarBoundary {
  const {endOfMonth, startOfMonth} = getMonthBoundary(year, month);
  const prevMonthDayCount = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;
  const nextMonthDayCount = 7 - endOfMonth.getDay();

  return {
    startOfMonth: new Date(year, month - 1, 1 - prevMonthDayCount),
    endOfMonth: new Date(year, month, nextMonthDayCount === 7 ? 0 : nextMonthDayCount)
  };
}

export interface CalendarDate {
  original: Date;
  year: number;
  month: number; // 현재 달과 1차이난다거나 그런거없이 다 보정된상태로 전달됨
  date: number;
  state: {
    isMatchedMonth: boolean;
    isLast: boolean;
    isFirst: boolean;
  };
}

// 기준 : 시작이 월요일
export function getCalendarWeekList<T = CalendarDate>(year: number, month: number, converter?: (date: CalendarDate) => T): T[][] {
  const {endOfMonth, startOfMonth} = getMonthBoundary(year, month);

  const prevMonthDayCount = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;

  const prevMonthDates = new Array(prevMonthDayCount)
    .fill('').map((_, index) => new Date(year, month - 1, index - prevMonthDayCount + 1));

  const currentMonthDates = new Array(endOfMonth.getDate())
    .fill('').map((_, index) => new Date(year, month - 1, index + 1));

  const nextMonthDayCount = 7 - endOfMonth.getDay();

  const nextMonthDates = new Array(nextMonthDayCount === 7 ? 0 : nextMonthDayCount)
    .fill('').map((_, index) => new Date(year, month, index + 1));

  const calendarDates: T[] = prevMonthDates.concat(currentMonthDates, nextMonthDates).map(date => {
    const numericDate = date.getDate();

    const calendarDate: CalendarDate = {
      original: date,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: numericDate,
      state: {
        isMatchedMonth: month === date.getMonth() + 1,
        isFirst: numericDate === 1,
        isLast: endOfMonth.getDate() === numericDate
      }
    };

    if (converter) {
      return converter(calendarDate);

    } else {
      return calendarDate as T;
    }
  });

  return arraySplit(calendarDates, 7);
}
