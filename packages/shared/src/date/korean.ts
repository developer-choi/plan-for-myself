import type {SimpleDate} from './lunar';

interface DestructedDate extends SimpleDate {
  hour: number;
  minute: number;
  second: number;
  milliSecond: number;
}

/* SimpleDate와 달리 month는 Date처럼 0부터 센다 */
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

export function getKoreanToday(now = new Date()): string {
  const {year, month, date} = getKoreanDate(now);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
}

export const KST = 9;

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
