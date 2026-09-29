import {getKoreanDate} from './korean';
import {convertLunarDateToSolar, type SimpleDate} from './lunar';
import type {DateType} from '../date-type/type';

const SUNDAY = 0;
const SATURDAY = 6;
// 음력 섣달그믐(12월 31일)은 양력으로 바꾸면 다음 해 설날 전날이라, 전해의 음력 날짜로 바꿔야 한다
const LUNAR_NEW_YEAR_EVE = {month: 12, date: 31};

/**
 * @description 휴일인지 판단해서 반환합니다.
 * 1. 토요일, 일요일이면 true
 * 2. 매년 무조건 있는 대한민국 공휴일이면 true
 * 3. 대체공휴일, 선거일 등의 규칙이 없는 공휴일은 false
 */
export function isHolidayDate({year, month, date}: SimpleDate) {
  return isHoliday(year, month, date);
}

export function getDefaultDateType(): DateType {
  const {year, month, date} = getKoreanDate();
  return isHoliday(year, month + 1, date) ? 'holiday' : 'weekday';
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
// month는 1부터 시작합니다.
function isHoliday(year: number, month: number, date: number) {
  const value = new Date(`${year}-${month}-${date}`);
  const day = value.getDay();

  if (day === SATURDAY || day === SUNDAY) {
    return true;
  }

  if (HOLIDAY.solar.some((holiday) => holiday.month === month && holiday.date === date)) {
    return true;
  }

  return HOLIDAY.lunar.some((holiday) => {
    const toPreviousYear = holiday.month === LUNAR_NEW_YEAR_EVE.month && holiday.date === LUNAR_NEW_YEAR_EVE.date;
    const solar = convertLunarDateToSolar(toPreviousYear ? year - 1 : year, holiday.month, holiday.date);
    return solar.month === month && solar.date === date;
  });
}

interface HolidayDate extends Omit<SimpleDate, 'year'> {
  type: 'solar' | 'lunar';
  name: string;
}

// 양력기준 달력에 나오는 순서대로 작성했음.
const HOLIDAY_LIST: HolidayDate[] = [
  {type: 'solar', month: 1, date: 1, name: '새해'},
  {type: 'lunar', month: 12, date: 31, name: '설날'},
  {type: 'lunar', month: 1, date: 1, name: '설날'},
  {type: 'lunar', month: 1, date: 2, name: '설날'},
  {type: 'solar', month: 3, date: 1, name: '삼일절'},
  {type: 'solar', month: 5, date: 1, name: '근로자의날'},
  {type: 'solar', month: 5, date: 5, name: '어린이날'},
  {type: 'lunar', month: 4, date: 8, name: '석가탄신일'},
  {type: 'solar', month: 6, date: 6, name: '현충일'},
  {type: 'solar', month: 8, date: 15, name: '광복절'},
  {type: 'lunar', month: 8, date: 14, name: '추석'},
  {type: 'lunar', month: 8, date: 15, name: '추석'},
  {type: 'lunar', month: 8, date: 16, name: '추석'},
  {type: 'solar', month: 10, date: 3, name: '개천절'},
  {type: 'solar', month: 10, date: 9, name: '한글날'},
  {type: 'solar', month: 12, date: 25, name: '크리스마스'},
];

const HOLIDAY: Record<HolidayDate['type'], HolidayDate[]> = {
  solar: HOLIDAY_LIST.filter(({type}) => type === 'solar'),
  lunar: HOLIDAY_LIST.filter(({type}) => type === 'lunar'),
};
