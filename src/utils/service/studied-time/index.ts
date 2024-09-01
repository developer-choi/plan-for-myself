import {DailyStudyTime} from '@/types/studied-time';
import {calculateTotal} from '@/utils/extend/data-type/number';
import {padToTwoDigits} from '@/utils/extend/data-type/string';

/**
 * @example (90) ==> '1:30'
 */
export function minutesFormat(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = padToTwoDigits(Math.floor(totalMinutes % 60).toString());
  return `${hours}:${minutes}`;
}

export function studiedTimeFormat(studiedMinutes: DailyStudyTime['studied_minutes']): string | null {
  const total = calculateTotal(studiedMinutes, value => value);

  if (total === 0) {
    return null;
  }

  return `${minutesFormat(total)} (${studiedMinutes.join('+')})`;
}
