import {getKoreanDate} from '@/utils/extend/date/korean';
import {isHoliday, SimpleDate} from '@forworkchoe/core/utils';
import {DateType} from '@/utils/service/constant/date-type';

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
