/* eslint-disable no-magic-numbers -- 소개 페이지 그림에만 쓰는 고정 예시 데이터라 숫자를 그대로 적는다 */
import type {
  FailureTag,
  FailureTagTrend,
  StudyRecord,
  StudyRecordMonthly,
  StudyRecordOverview,
} from '@plan-for-myself/shared';
import {isReduced} from '@/server/study-record-stats/tag-count';
import type {CalendarMonth} from '@/study-record/calendar-date';

export const INTRO_MONTH: CalendarMonth = {year: 2026, month: 9};
export const INTRO_TAG = '늦잠';

const FAIL_TAGS: Partial<Record<number, string[]>> = {
  7: ['늦잠'],
  12: ['게임'],
  14: ['늦잠'],
  21: ['늦잠'],
  24: ['게임'],
  28: ['늦잠'],
};
const MISSING_DAYS = [9, 17];
const STUDY_MINUTES = [210, 95, 120, 150, 185, 240];
const LAST_DAY = 30;

export const INTRO_RECORDS: StudyRecord[] = Array.from({length: LAST_DAY}, (_day, index) => index + 1)
  .filter((day) => !MISSING_DAYS.includes(day))
  .map((day) => ({
    pk: day,
    date: `2026-09-${String(day).padStart(2, '0')}`,
    dateType: 'weekday',
    studiedMinutes: [STUDY_MINUTES[day % STUDY_MINUTES.length], 0, 0],
    failTags: FAIL_TAGS[day] ?? [],
  }));

export const INTRO_FORM_RECORD: StudyRecord = {
  pk: 24,
  date: '2026-09-24',
  dateType: 'weekday',
  studiedMinutes: [60, 30, 120],
  failTags: FAIL_TAGS[24] ?? [],
};

const AUGUST_COUNTS = {늦잠: 3, 게임: 0, 과식: 3} as const;

export const INTRO_MONTHLY: StudyRecordMonthly = {
  month: '2026-09',
  inProgress: true,
  recordedDays: {count: INTRO_RECORDS.length, total: LAST_DAY},
  study: {totalMinutes: 4800, weekdayAvg: 170, holidayAvg: 180, prevWeekdayAvg: 160, prevHolidayAvg: 170},
  failureTags: Object.entries(AUGUST_COUNTS).map(([tag, previousCount]) => toFailureTag(tag, previousCount)),
};

export const INTRO_TREND: FailureTagTrend[] = [
  {month: '2026-04', count: 7, previousCount: 9, status: 'reduced'},
  {month: '2026-05', count: 8, previousCount: 7, status: 'repeated'},
  {month: '2026-06', count: 5, previousCount: 8, status: 'reduced'},
  {month: '2026-07', count: 6, previousCount: 5, status: 'repeated'},
  {month: '2026-08', count: AUGUST_COUNTS[INTRO_TAG], previousCount: 6, status: 'reduced'},
  {month: '2026-09', count: countTag(INTRO_TAG), previousCount: AUGUST_COUNTS[INTRO_TAG], status: 'repeated'},
];

export const INTRO_STREAK: StudyRecordOverview['streak'] = {current: LAST_DAY - Math.max(...MISSING_DAYS), longest: 21};

function countTag(tag: string): number {
  return INTRO_RECORDS.filter((record) => record.failTags.includes(tag)).length;
}

function toFailureTag(tag: string, previousCount: number): FailureTag {
  const count = countTag(tag);
  return {tag, count, previousCount, status: getStatus(count, previousCount), trend: []};
}

function getStatus(count: number, previousCount: number): FailureTag['status'] {
  if (previousCount === 0) {
    return 'appeared';
  }
  return isReduced(count, previousCount) ? 'reduced' : 'repeated';
}
