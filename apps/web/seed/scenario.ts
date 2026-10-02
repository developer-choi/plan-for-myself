import {isHolidayDate, type DateType, type SimpleDate, type StudyRecord} from '@plan-for-myself/shared';
import {addDays, getMonthDay, listDays} from './date';

export type SeedRecord = Omit<StudyRecord, 'pk' | 'timestamp'> & {day: SimpleDate};

export type ScenarioName = keyof typeof SCENARIOS;

export const SCENARIOS = {
  streak(base: SimpleDate) {
    requireDateFrom(base, 'streak', 2);
    const oldStart = getMonthDay(base, TWO_MONTHS_AGO);
    const oldRun = listDays(oldStart, addDays(oldStart, OLD_STREAK_DAYS - 1)).map((day) => createRecord(day));
    const currentRun = listDays(getMonthDay(base, -1, STREAK_START_DATE), addDays(base, -1)).map((day, index) =>
      createRecord(day, STREAK_FAIL_TAGS[index % STREAK_FAIL_TAGS.length]),
    );
    return [...oldRun, ...currentRun];
  },
  large(base: SimpleDate) {
    return listDays(addDays(base, -LARGE_RECORD_COUNT), addDays(base, -1)).map((day, index) =>
      createRecord(day, STREAK_FAIL_TAGS[index % STREAK_FAIL_TAGS.length]),
    );
  },
  'fail-compare'(base: SimpleDate) {
    requireDateFrom(base, 'fail-compare', FAIL_COMPARE_THIS_MONTH.length + 1);
    return [
      ...FAIL_COMPARE_LAST_MONTH.map((tags, index) => createRecord(getMonthDay(base, -1, index + 1), tags)),
      ...FAIL_COMPARE_THIS_MONTH.map((tags, index) => createRecord(getMonthDay(base, 0, index + 1), tags)),
    ];
  },
  'no-fail'(base: SimpleDate) {
    requireDateFrom(base, 'no-fail', 2);
    const lastMonth = listDays(getMonthDay(base, -1), getMonthDay(base, -1, NO_FAIL_DAYS));
    const thisMonth = listDays(getMonthDay(base, 0), addDays(base, -1)).slice(0, NO_FAIL_DAYS);
    return [...lastMonth, ...thisMonth].map((day) => createRecord(day));
  },
  'tag-detail'(base: SimpleDate) {
    requireDateFrom(base, 'tag-detail', TAG_DETAIL_THIS_MONTH.length + 1);
    return [
      ...TAG_DETAIL_PAST_MONTHS.map(({monthOffset, tags}) => createRecord(getMonthDay(base, monthOffset), tags)),
      ...TAG_DETAIL_THIS_MONTH.map((tags, index) => createRecord(getMonthDay(base, 0, index + 1), tags)),
    ];
  },
  empty() {
    return [];
  },
  'three-days'(base: SimpleDate) {
    requireDateFrom(base, 'three-days', THREE_DAYS + 1);
    return listDays(addDays(base, -THREE_DAYS), addDays(base, -1)).map((day) => createRecord(day, ['늦잠'], 'weekday'));
  },
  'first-day'(base: SimpleDate) {
    requireDateFrom(base, 'first-day', 2);
    return [createRecord(addDays(base, -1), ['늦잠'])];
  },
} satisfies Record<string, (base: SimpleDate) => SeedRecord[]>;

export function isScenarioName(name: string): name is ScenarioName {
  return Object.hasOwn(SCENARIOS, name);
}

const TWO_MONTHS_AGO = -2;
const OLD_STREAK_DAYS = 5;
const STREAK_START_DATE = 15;
const LARGE_RECORD_COUNT = 620;
const NO_FAIL_DAYS = 5;
const THREE_DAYS = 3;
const STREAK_FAIL_TAGS = [['늦잠'], [], ['휴대폰'], [], ['늦잠', '피곤함'], []];
const STUDIED_MINUTES = [
  {morning: 60, afternoon: 120, evening: 90},
  {morning: 30, afternoon: 90, evening: 120},
  {morning: 90, afternoon: 60, evening: 60},
];

const FAIL_COMPARE_LAST_MONTH = [
  ['늦잠', '유튜브'],
  ['늦잠', '유튜브'],
  ['늦잠', '유튜브'],
  ['피곤함', '유튜브'],
  ['피곤함', '유튜브'],
  ['피곤함'],
];
const FAIL_COMPARE_THIS_MONTH = [
  ['늦잠', '휴대폰'],
  ['늦잠', '휴대폰'],
  ['늦잠', '유튜브'],
  ['늦잠', '유튜브'],
];

const TAG_DETAIL_PAST_MONTHS = [
  {monthOffset: -5, tags: ['야식']},
  {monthOffset: -4, tags: ['야식']},
  {monthOffset: -3, tags: ['늦잠']},
  {monthOffset: -2, tags: ['야식']},
  {monthOffset: -1, tags: ['야식']},
];
const TAG_DETAIL_THIS_MONTH = [
  ['야식', '두통'],
  ['늦잠', '휴대폰'],
  ['피곤함', '유튜브'],
  ['게임', '낮잠'],
  ['약속', '과식'],
  ['술자리'],
];

function createRecord(day: SimpleDate, failTags: string[] = [], dateType?: DateType): SeedRecord {
  const {morning, afternoon, evening} = STUDIED_MINUTES[day.date % STUDIED_MINUTES.length];
  return {
    day,
    date_type: dateType ?? (isHolidayDate(day) ? 'holiday' : 'weekday'),
    studied_minutes: [morning, afternoon, evening],
    fail_tags: failTags,
  };
}

function requireDateFrom(base: SimpleDate, name: string, minDate: number) {
  if (base.date < minDate) {
    throw new Error(
      `${name} 시나리오는 기준 날짜가 ${minDate}일 이후여야 한다 (기준 날짜 ${base.month}월 ${base.date}일)`,
    );
  }
}
