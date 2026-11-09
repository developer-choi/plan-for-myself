import {minutesFormat} from './format';
import type {StudyRecord} from './type';

export interface CalendarCellBadges {
  /* 그날 공부시간 합계가 0분이면 null */
  studiedTime: string | null;
  failTags: string[];
}

/* 그날 기록이 없으면 record는 undefined */
export function getCalendarCellBadges(record?: StudyRecord): CalendarCellBadges {
  const totalMinutes = record?.studiedMinutes.reduce((sum, minutes) => sum + minutes, 0) ?? 0;

  return {
    studiedTime: totalMinutes > 0 ? minutesFormat(totalMinutes) : null,
    failTags: record?.failTags.slice(0, MAX_FAIL_TAGS) ?? [],
  };
}

const MAX_FAIL_TAGS = 2;
