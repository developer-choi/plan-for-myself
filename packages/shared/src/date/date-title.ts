import {parseDateParam} from './month-param';

export function formatDateTitle(date: string): string {
  const {year, month, date: day} = parseDateParam(date);
  const dayName = DAY_NAMES[new Date(year, month - 1, day).getDay()] ?? '';
  return `${month}월 ${day}일 (${dayName})`;
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;
