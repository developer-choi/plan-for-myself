import {padToTwoDigits} from '@forworkchoe/core/utils';

export function convertStudiedTimeTimestamp(year: number, month: number, date: number) {
  return new Date(`${year}-${month}-${date} 13:00:00`).getTime();
}

export function dateFormatter(value: Date) {
  const year = padToTwoDigits(value.getFullYear());
  const month = padToTwoDigits(value.getMonth() + 1);
  const date = padToTwoDigits(value.getDate());
  const hour = padToTwoDigits(value.getHours());
  const minute = padToTwoDigits(value.getMinutes());
  const second = padToTwoDigits(value.getSeconds());

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}
