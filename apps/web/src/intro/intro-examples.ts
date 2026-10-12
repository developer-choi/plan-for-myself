/* eslint-disable no-magic-numbers -- 소개 페이지 그림에만 쓰는 고정 예시 데이터라 숫자를 그대로 적는다 */
import type {FailureTagTrend, StudyRecord, StudyRecordMonthly} from '@plan-for-myself/shared';
import type {CalendarMonth} from '@/study-record/calendar-date';

export const INTRO_TREND_TAG = '늦잠';
export const INTRO_TREND: FailureTagTrend[] = [
  {month: '2026-04', count: 3, previousCount: 2, status: 'repeated'},
  {month: '2026-05', count: 5, previousCount: 3, status: 'repeated'},
  {month: '2026-06', count: 6, previousCount: 5, status: 'repeated'},
  {month: '2026-07', count: 5, previousCount: 6, status: 'reduced'},
  {month: '2026-08', count: 3, previousCount: 5, status: 'reduced'},
  {month: '2026-09', count: 1, previousCount: 3, status: 'reduced'},
];

export const INTRO_FORM_RECORD: StudyRecord = {
  pk: 1,
  date: '2026-09-24',
  dateType: 'weekday',
  studiedMinutes: [60, 30, 120],
  failTags: ['늦잠', '과식'],
};

export const INTRO_CALENDAR_MONTH: CalendarMonth = {year: 2026, month: 9};
/* 30일까지 다 지난 달로 그리려고 오늘을 30일로 둔다 */
export const INTRO_CALENDAR_TODAY = '2026-09-30';

const FAIL_TAGS: Partial<Record<number, string[]>> = {
  2: ['늦잠'],
  3: ['늦잠', '과식'],
  4: ['늦잠'],
  8: ['게임'],
  14: ['늦잠'],
  21: ['과식'],
  22: ['늦잠', '게임'],
};
const MISSING_DAYS = [6, 17];
const STUDY_MINUTES = [210, 95, 120, 150, 185, 240];
const LAST_DAY = 30;

export const INTRO_CALENDAR_RECORDS: StudyRecord[] = Array.from({length: LAST_DAY}, (_day, index) => index + 1)
  .filter((day) => !MISSING_DAYS.includes(day))
  .map((day) => ({
    pk: day,
    date: `2026-09-${String(day).padStart(2, '0')}`,
    dateType: 'weekday',
    studiedMinutes: [STUDY_MINUTES[day % STUDY_MINUTES.length], 0, 0],
    failTags: FAIL_TAGS[day] ?? [],
  }));

export const INTRO_MONTHLY: StudyRecordMonthly = {
  month: '2026-09',
  inProgress: true,
  recordedDays: {count: 28, total: 30},
  study: {totalMinutes: 4800, weekdayAvg: 170, holidayAvg: 180, prevWeekdayAvg: 160, prevHolidayAvg: 170},
  failureTags: [
    {tag: '늦잠', count: 4, previousCount: 3, status: 'repeated', trend: []},
    {tag: '게임', count: 2, previousCount: 0, status: 'appeared', trend: []},
    {tag: '과식', count: 0, previousCount: 3, status: 'reduced', trend: []},
  ],
};
