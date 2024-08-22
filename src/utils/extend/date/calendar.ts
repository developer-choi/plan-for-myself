import {arraySplit} from '@/utils/extend/data-type/array';

export interface DateBoundary {
  start: Date;
  end: Date;
}

/**
 * @return start 해당 월의 첫 번째 일의 Date 객체
 * @return end 해당 월의 마지막 일의 Date 객체
 */
export function getMonthBoundary(year: number, month: number): DateBoundary {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return {
    start,
    end,
  };
}

/**
 * @return start 해당 월의 첫 번째 일의 Date 객체
 * @return end 해당 월의 마지막 일의 Date 객체
 */
export function getWeekBoundary(date: Date): DateBoundary {
  const count = date.getDay() === 0 ? 6 : date.getDay() - 1;

  const start = new Date(date.getTime());
  start.setDate(start.getDate() - count);

  const end = new Date(date.getTime());
  end.setDate(end.getDate() + (6 - count));

  return {
    start,
    end
  };
}

export function getCalendarBoundary(year: number, month: number): DateBoundary {
  const {end, start} = getMonthBoundary(year, month);
  const prevMonthDayCount = start.getDay() === 0 ? 6 : start.getDay() - 1;
  const nextMonthDayCount = 7 - end.getDay();

  return {
    start: new Date(year, month - 1, 1 - prevMonthDayCount),
    end: new Date(year, month, nextMonthDayCount === 7 ? 0 : nextMonthDayCount)
  };
}

export interface CalendarDate {
  original: Date;
  year: number;
  month: number; // 현재 달과 1차이난다거나 그런거없이 다 보정된상태로 전달됨
  date: number;

  // 마크업 할 때 사용
  state: {
    // 현재 날짜와 상관없는 해당 달력만의 정보
    calendar: {
      isMatchedMonth: boolean; // 달력의 월과 같은 월인지. ("달력" 기준 저번달, 다음달인지 아닌지)
      isLastDate: boolean; // 해당 월의 마지막 날인지
      isFirstDate: boolean; // 해당 월의 첫 날인지
    };

    // 현재 날짜와 관련이 있는 달력의 정보
    current: {
      isThisWeek: boolean; // 이번주와 달력의 특정 일이 같은 주인지
      isToday: boolean; // 오늘과 동일한 날짜인지 여부
    };
  };
}

// 기준 : 시작이 월요일
export function getCalendarWeekList<T = CalendarDate>(year: number, month: number, converter?: (date: CalendarDate) => T): T[][] {
  const {end, start} = getMonthBoundary(year, month);

  const prevMonthDayCount = start.getDay() === 0 ? 6 : start.getDay() - 1;

  const prevMonthDates = new Array(prevMonthDayCount)
    .fill('').map((_, index) => new Date(year, month - 1, index - prevMonthDayCount + 1));

  const currentMonthDates = new Array(end.getDate())
    .fill('').map((_, index) => new Date(year, month - 1, index + 1));

  const nextMonthDayCount = 7 - end.getDay();

  const nextMonthDates = new Array(nextMonthDayCount === 7 ? 0 : nextMonthDayCount)
    .fill('').map((_, index) => new Date(year, month, index + 1));

  const today = new Date();
  const thisWeek = getWeekBoundary(today);

  const calendarDates: T[] = prevMonthDates.concat(currentMonthDates, nextMonthDates).map(date => {
    const numericDate = date.getDate();
    const isMatchedMonth = month === date.getMonth() + 1;

    const calendarDate: CalendarDate = {
      original: date,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: numericDate,
      state: {
        calendar: {
          isMatchedMonth,
          isFirstDate: isMatchedMonth && numericDate === 1,
          isLastDate: isMatchedMonth && end.getDate() === numericDate
        },
        current: {
          isThisWeek: thisWeek.start.getDate() <= numericDate && numericDate <= thisWeek.end.getDate(),
          isToday: numericDate === today.getDate(),
        },
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
