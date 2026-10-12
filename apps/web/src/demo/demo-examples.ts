/* eslint-disable no-magic-numbers -- 예시 달력·통계에만 쓰는 고정 예시 데이터라 숫자를 그대로 적는다 */
import {
  isHolidayDate,
  type StudyRecord,
  type StudyRecordMonthly,
  type StudyRecordOverview,
} from '@plan-for-myself/shared';
import {calculateMonthly} from '@/server/study-record-stats/monthly';
import {calculateOverview} from '@/server/study-record-stats/overview';
import {getDemoMonth, getDemoToday, getLastDayOfMonth, toDateString} from '@/demo/demo-today';
import {type CalendarMonth, shiftMonth, toMonthParam} from '@/study-record/calendar-date';

export {getDemoMonth, getDemoToday} from '@/demo/demo-today';

export type DemoOverview = StudyRecordOverview & {firstRecordDate: string};

/*
 * 예시 기록은 이번 달 기준 몇 달 전 며칠로 적는다. 월별 추이가 최대 6개월이라 그만큼만 둔다
 * day가 0 이하면 그 달 말일에서 센다(0 = 말일). 달 길이가 28~31로 달라도 이번 달 끝의 연속 기록이 말일까지 이어진다
 * 이번 달 앞쪽 날짜는 13일 이하로 둔다 — 2월이면 말일에서 센 첫날이 15일이라, 14일을 넣으면 연속 기록에 붙어 달마다 길이가 달라진다
 */
type DemoRecordRow = [
  monthsAgo: number,
  day: number,
  studiedMinutes: StudyRecord['studiedMinutes'],
  ...failTags: string[],
];

const OVERSLEEP = '늦잠';
const GAME = '게임';
const NAP = '낮잠';
const LATE_SNACK = '야식';

const DEMO_RECORD_ROWS: DemoRecordRow[] = [
  [5, 4, [30, 60, 0], GAME],
  [5, 12, [0, 90, 30], GAME, LATE_SNACK],
  [5, 20, [60, 30, 60]],
  [4, 2, [0, 60, 30], GAME],
  [4, 9, [30, 90, 0], OVERSLEEP],
  [4, 17, [60, 60, 30], GAME],
  [4, 24, [0, 120, 60]],
  [3, 3, [30, 60, 60], GAME, OVERSLEEP],
  [3, 8, [0, 90, 30], GAME],
  [3, 15, [60, 60, 90], LATE_SNACK],
  [3, 22, [30, 90, 0], OVERSLEEP],
  [3, 27, [0, 120, 60]],
  [2, 1, [60, 60, 30], GAME, OVERSLEEP],
  [2, 3, [0, 90, 60], GAME],
  [2, 6, [30, 60, 90], GAME, LATE_SNACK],
  [2, 8, [60, 0, 60], OVERSLEEP],
  [2, 11, [0, 120, 60], GAME],
  [2, 15, [30, 90, 30], OVERSLEEP, LATE_SNACK],
  [2, 20, [60, 60, 0]],
  [2, 25, [0, 120, 90]],
  [1, 2, [60, 90, 30], OVERSLEEP, GAME],
  [1, 4, [0, 60, 60], OVERSLEEP],
  [1, 7, [30, 90, 60], OVERSLEEP, LATE_SNACK],
  [1, 10, [60, 60, 30], GAME],
  [1, 13, [0, 120, 60], OVERSLEEP, GAME],
  [1, 18, [30, 60, 90], OVERSLEEP, LATE_SNACK],
  [1, 22, [60, 90, 0]],
  [1, 27, [0, 90, 120]],
  [0, 1, [60, 90, 30], OVERSLEEP],
  [0, 3, [30, 60, 60], OVERSLEEP, NAP],
  [0, 7, [0, 120, 60], NAP],
  [0, 10, [60, 60, 90], OVERSLEEP],
  [0, 12, [30, 90, 30], GAME, OVERSLEEP],
  [0, -13, [0, 90, 60]],
  [0, -12, [30, 60, 90]],
  [0, -11, [60, 120, 30]],
  [0, -10, [0, 90, 120]],
  [0, -9, [60, 60, 60], OVERSLEEP],
  [0, -8, [30, 90, 30]],
  [0, -7, [0, 120, 60]],
  [0, -6, [30, 120, 30], OVERSLEEP],
  [0, -5, [60, 60, 90]],
  [0, -4, [0, 90, 90]],
  [0, -3, [30, 120, 60]],
  [0, -2, [0, 60, 90]],
  [0, -1, [60, 90, 30]],
  [0, 0, [60, 90, 60]],
];

export function getDemoRecords(now = new Date()): StudyRecord[] {
  const thisMonth = getDemoMonth(now);

  return DEMO_RECORD_ROWS.map(([monthsAgo, day, studiedMinutes, ...failTags], index) => {
    const date = toDemoDate(shiftMonth(thisMonth, -monthsAgo), day);
    return {pk: index + 1, date, dateType: isHoliday(date) ? 'holiday' : 'weekday', studiedMinutes, failTags};
  });
}

export function getDemoMonthly(month: CalendarMonth, now = new Date()): StudyRecordMonthly {
  return calculateMonthly(getDemoRecords(now), toMonthParam(month), getDemoToday(now));
}

export function getDemoOverview(now = new Date()): DemoOverview {
  const overview = calculateOverview(getDemoRecords(now), getDemoToday(now));

  if (overview.firstRecordDate === null) {
    throw new Error('예시 기록이 비어 있다');
  }

  return {...overview, firstRecordDate: overview.firstRecordDate};
}

function toDemoDate(month: CalendarMonth, day: number) {
  return toDateString(month, day > 0 ? day : getLastDayOfMonth(month) + day);
}

function isHoliday(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return isHolidayDate({year, month, date: day});
}
