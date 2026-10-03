import type {StudyRecord} from './type';

export function minutesFormat(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = Math.floor(totalMinutes % MINUTES_PER_HOUR)
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function studiedTimeFormat(studiedMinutes: StudyRecord['studiedMinutes']): string | null {
  const total = studiedMinutes.reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return null;
  }

  return `${minutesFormat(total)} (${studiedMinutes.join('+')})`;
}

const MINUTES_PER_HOUR = 60;
