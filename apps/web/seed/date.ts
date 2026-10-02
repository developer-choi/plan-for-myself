import {KST, type SimpleDate} from '@plan-for-myself/shared';

export function addDays(day: SimpleDate, amount: number): SimpleDate {
  return fromUTCDate(new Date(Date.UTC(day.year, day.month - 1, day.date + amount)));
}

export function getMonthDay(base: SimpleDate, monthOffset: number, date = 1): SimpleDate {
  return fromUTCDate(new Date(Date.UTC(base.year, base.month - 1 + monthOffset, date)));
}

export function listDays(from: SimpleDate, to: SimpleDate): SimpleDate[] {
  const days: SimpleDate[] = [];
  for (let day = from; toUTCTime(day) <= toUTCTime(to); day = addDays(day, 1)) {
    days.push(day);
  }
  return days;
}

/* 옛 코드가 기록 날짜를 그 날 13:00의 밀리초로 저장했다. 시드를 돌리는 컴퓨터의 시간대와 상관없이 한국 시간 13:00으로 맞춘다 */
export function toRecordTimestamp(day: SimpleDate) {
  return Date.UTC(day.year, day.month - 1, day.date, RECORD_HOUR - KST);
}

export function toRecordDate(day: SimpleDate) {
  return [day.year, day.month, day.date].map((value) => String(value).padStart(2, '0')).join('-');
}

const RECORD_HOUR = 13;

function toUTCTime(day: SimpleDate) {
  return Date.UTC(day.year, day.month - 1, day.date);
}

function fromUTCDate(value: Date): SimpleDate {
  return {year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, date: value.getUTCDate()};
}
