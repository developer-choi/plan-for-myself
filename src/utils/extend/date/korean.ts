import {DestructedDate} from '@forworkchoe/core/utils';

/**
 * 이 로직이 실행된 환경의 시스템 시간대가 한국이 아닌 다른 나라라고 할지라도, 한국 시간대로 변환함.
 * 하와이 (GMT-10) 에서 new Date('2024-12-01 00:00:00') 값을 전달하면 ==> (한국기준) 2024년 12월 1일 19:00:00에 해당하는 객체가 반환됨.
 */
export function getKoreanDate(date = new Date()): DestructedDate {
  const koreaDate = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours() + KST,
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  );
  return convertUTCDateProperty(koreaDate);
}

function convertUTCDateProperty(date: Date): DestructedDate {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    date: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    milliSecond: date.getUTCMilliseconds(),
  };
}

export const KST = 9; // GMT + 9
