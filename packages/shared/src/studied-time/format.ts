import type {DailyStudyTime} from './type';

/**
 * @example (90) ==> '1:30'
 */
export function minutesFormat(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function studiedTimeFormat(studiedMinutes: DailyStudyTime['studied_minutes']): string | null {
  const total = studiedMinutes.reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return null;
  }

  return `${minutesFormat(total)} (${studiedMinutes.join('+')})`;
}
