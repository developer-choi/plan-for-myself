/* eslint-disable no-magic-numbers -- 예시 달력·통계에만 쓰는 고정 예시 데이터라 숫자를 그대로 적는다 */
import {
  isHolidayDate,
  type StudyRecord,
  type StudyRecordMonthly,
  type StudyRecordOverview,
} from '@plan-for-myself/shared';
import {calculateMonthly} from '@/server/study-record-stats/monthly';
import {calculateOverview} from '@/server/study-record-stats/overview';
import {type CalendarMonth, toMonthParam} from '@/study-record/calendar-date';

export const DEMO_TODAY = '2026-09-30';

export const DEMO_MONTH: CalendarMonth = {year: Number(DEMO_TODAY.slice(0, 4)), month: Number(DEMO_TODAY.slice(5, 7))};

export type DemoOverview = StudyRecordOverview & {firstRecordDate: string};

type DemoRecordRow = [date: string, studiedMinutes: StudyRecord['studiedMinutes'], ...failTags: string[]];

const OVERSLEEP = '늦잠';
const ENGLISH_WORDS = '영어 단어';
const ALGORITHM = '알고리즘';
const SMARTPHONE = '스마트폰';

const DEMO_RECORD_ROWS: DemoRecordRow[] = [
  ['2026-07-01', [60, 60, 30], ENGLISH_WORDS, OVERSLEEP],
  ['2026-07-03', [0, 90, 60], ENGLISH_WORDS],
  ['2026-07-06', [30, 60, 90], ENGLISH_WORDS, SMARTPHONE],
  ['2026-07-08', [60, 0, 60], OVERSLEEP],
  ['2026-07-11', [0, 120, 60], ENGLISH_WORDS],
  ['2026-07-15', [30, 90, 30], OVERSLEEP, SMARTPHONE],
  ['2026-07-20', [60, 60, 0]],
  ['2026-07-25', [0, 120, 90]],
  ['2026-08-02', [60, 90, 30], OVERSLEEP, ENGLISH_WORDS],
  ['2026-08-04', [0, 60, 60], OVERSLEEP],
  ['2026-08-07', [30, 90, 60], OVERSLEEP, SMARTPHONE],
  ['2026-08-10', [60, 60, 30], ENGLISH_WORDS],
  ['2026-08-13', [0, 120, 60], OVERSLEEP, ENGLISH_WORDS],
  ['2026-08-18', [30, 60, 90], OVERSLEEP, SMARTPHONE],
  ['2026-08-22', [60, 90, 0]],
  ['2026-08-27', [0, 90, 120]],
  ['2026-09-01', [60, 90, 30], OVERSLEEP],
  ['2026-09-03', [30, 60, 60], OVERSLEEP, ALGORITHM],
  ['2026-09-07', [0, 120, 60], ALGORITHM],
  ['2026-09-10', [60, 60, 90], OVERSLEEP],
  ['2026-09-14', [30, 90, 30], ENGLISH_WORDS, OVERSLEEP],
  ['2026-09-17', [0, 90, 60]],
  ['2026-09-18', [30, 60, 90]],
  ['2026-09-19', [60, 120, 30]],
  ['2026-09-20', [0, 90, 120]],
  ['2026-09-21', [60, 60, 60], OVERSLEEP],
  ['2026-09-22', [30, 90, 30]],
  ['2026-09-23', [0, 120, 60]],
  ['2026-09-24', [30, 120, 30], OVERSLEEP],
  ['2026-09-25', [60, 60, 90]],
  ['2026-09-26', [0, 90, 90]],
  ['2026-09-27', [30, 120, 60]],
  ['2026-09-28', [0, 60, 90]],
  ['2026-09-29', [60, 90, 30]],
  ['2026-09-30', [60, 90, 60]],
];

export const DEMO_RECORDS: StudyRecord[] = DEMO_RECORD_ROWS.map(([date, studiedMinutes, ...failTags], index) => ({
  pk: index + 1,
  date,
  dateType: isHoliday(date) ? 'holiday' : 'weekday',
  studiedMinutes,
  failTags,
}));

export const DEMO_OVERVIEW: DemoOverview = createDemoOverview();

export function getDemoMonthly(month: CalendarMonth): StudyRecordMonthly {
  return calculateMonthly(DEMO_RECORDS, toMonthParam(month), DEMO_TODAY);
}

function createDemoOverview(): DemoOverview {
  const overview = calculateOverview(DEMO_RECORDS, DEMO_TODAY);

  if (overview.firstRecordDate === null) {
    throw new Error('예시 기록이 비어 있다');
  }

  return {...overview, firstRecordDate: overview.firstRecordDate};
}

function isHoliday(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return isHolidayDate({year, month, date: day});
}
