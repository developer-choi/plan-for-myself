import type {SimpleDate} from '@plan-for-myself/shared';
import {describe, expect, it} from 'vitest';
import {addDays} from './date';
import {isScenarioName, SCENARIOS, type ScenarioName, type SeedRecord} from './scenario';

describe('streak', () => {
  it('지난달 15일부터 기준 날짜 전날까지 끊김 없이 이어지고, 그 앞의 짧은 연속은 끊겨 있다', () => {
    const records = SCENARIOS.streak(SEPTEMBER_24);

    expect(countCurrentStreak(records, SEPTEMBER_24)).toBe(AUGUST_15_TO_SEPTEMBER_23);
    expect(countLongestStreak(records)).toBe(AUGUST_15_TO_SEPTEMBER_23);
    expect(countByMonths(records, ['2026-07'])).toEqual({'2026-07': 5});
    expect(hasRecord(records, toDay('2026-08-14'))).toBe(false);
  });

  it('이번 달과 지난달에 걸치고, 평일·휴일과 실패 태그가 있는 기록이 섞여 있다', () => {
    const records = SCENARIOS.streak(SEPTEMBER_24);

    expect(countByMonth(records, '2026-09')).toBeGreaterThan(0);
    expect(countByMonth(records, '2026-08')).toBeGreaterThan(0);
    expect(new Set(records.map((record) => record.date_type))).toEqual(new Set(['weekday', 'holiday']));
    expect(records.some((record) => record.fail_tags.length > 0)).toBe(true);
  });

  it('토·일요일과 공휴일 기록은 휴일이고 나머지는 평일이다', () => {
    const records = SCENARIOS.streak(OCTOBER_10);

    expect(findRecord(records, toDay('2026-09-19'))?.date_type).toBe('holiday');
    expect(findRecord(records, toDay('2026-09-25'))?.date_type).toBe('holiday');
    expect(findRecord(records, toDay('2026-09-21'))?.date_type).toBe('weekday');
  });
});

describe('large', () => {
  it('기준 날짜 전날까지 하루 하나씩 620행이다', () => {
    const records = SCENARIOS.large(SEPTEMBER_24);

    expect(records).toHaveLength(PRODUCTION_RECORD_COUNT);
    expect(countCurrentStreak(records, SEPTEMBER_24)).toBe(PRODUCTION_RECORD_COUNT);
  });
});

describe('fail-compare', () => {
  it('지난달·이번 달 태그 횟수가 반복·새로 생김·줄어듦 모양이다', () => {
    const records = SCENARIOS['fail-compare'](SEPTEMBER_24);

    expect(countTagByMonths(records, '늦잠', ['2026-08', '2026-09'])).toEqual({'2026-08': 3, '2026-09': 4});
    expect(countTagByMonths(records, '휴대폰', ['2026-08', '2026-09'])).toEqual({'2026-08': 0, '2026-09': 2});
    expect(countTagByMonths(records, '피곤함', ['2026-08', '2026-09'])).toEqual({'2026-08': 3, '2026-09': 0});
    expect(countTagByMonths(records, '유튜브', ['2026-08', '2026-09'])).toEqual({'2026-08': 5, '2026-09': 2});
  });

  it('기준 날짜가 1월이면 지난달을 지난해 12월로 만든다', () => {
    const records = SCENARIOS['fail-compare'](JANUARY_15);

    expect(countByMonths(records, ['2026-12', '2027-01'])).toEqual({'2026-12': 6, '2027-01': 4});
  });
});

describe('no-fail', () => {
  it('지난달·이번 달 기록이 있고 실패 태그가 하나도 없다', () => {
    const records = SCENARIOS['no-fail'](SEPTEMBER_24);

    expect(countByMonth(records, '2026-08')).toBeGreaterThan(0);
    expect(countByMonth(records, '2026-09')).toBeGreaterThan(0);
    expect(records.every((record) => record.fail_tags.length === 0)).toBe(true);
  });
});

describe('tag-detail', () => {
  it('이번 달 실패 태그가 10개를 넘는다', () => {
    const records = SCENARIOS['tag-detail'](SEPTEMBER_24);
    const tags = new Set(
      records.filter((record) => isInMonth(record, '2026-09')).flatMap((record) => record.fail_tags),
    );

    expect(tags.size).toBeGreaterThan(MANY_TAGS_THRESHOLD);
  });

  it('야식은 4월에 처음 나오고 6월에만 0번이라 4~9월 막대 6개가 나온다', () => {
    const records = SCENARIOS['tag-detail'](SEPTEMBER_24);

    expect(countTagByMonths(records, '야식', ['2026-01', '2026-02', '2026-03'])).toEqual({
      '2026-01': 0,
      '2026-02': 0,
      '2026-03': 0,
    });
    expect(
      countTagByMonths(records, '야식', ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']),
    ).toEqual({'2026-04': 1, '2026-05': 1, '2026-06': 0, '2026-07': 1, '2026-08': 1, '2026-09': 1});
  });

  it('두통은 이번 달에 처음 나온다', () => {
    const records = SCENARIOS['tag-detail'](SEPTEMBER_24);
    const headache = records.filter((record) => record.fail_tags.includes('두통'));

    expect(headache.every((record) => isInMonth(record, '2026-09'))).toBe(true);
    expect(headache).toHaveLength(1);
  });
});

describe('empty', () => {
  it('기록이 없다', () => {
    expect(SCENARIOS.empty()).toEqual([]);
  });
});

describe('three-days', () => {
  it('기준 날짜 3일 전부터 전날까지 평일 사흘이고 지난달 기록이 없다', () => {
    const records = SCENARIOS['three-days'](SEPTEMBER_24);

    expect(records.map((record) => toKey(record.day))).toEqual(['2026-09-21', '2026-09-22', '2026-09-23']);
    expect(records.every((record) => record.date_type === 'weekday')).toBe(true);
    expect(records.every((record) => record.fail_tags.length > 0)).toBe(true);
  });
});

describe('first-day', () => {
  it('이번 달 기준 날짜 전날 기록 하나라 연속 1일이고 역대 최장도 1일이다', () => {
    const records = SCENARIOS['first-day'](SEPTEMBER_24);

    expect(records.map((record) => toKey(record.day))).toEqual(['2026-09-23']);
    expect(countLongestStreak(records)).toBe(1);
  });
});

describe('기준 날짜 하한', () => {
  it.for(DATE_LIMITS)('$name: $accepted부터 만들고 $rejected는 「$message」로 거부한다', (limit) => {
    expect(() => SCENARIOS[limit.name](toDay(limit.accepted))).not.toThrow();
    expect(() => SCENARIOS[limit.name](toDay(limit.rejected))).toThrow(limit.message);
  });
});

describe('모든 시나리오', () => {
  it.for(Object.keys(SCENARIOS).filter(isScenarioName))(
    '%s: 하루에 기록이 하나뿐이고 모두 기준 날짜 전이다',
    (name) => {
      const keys = SCENARIOS[name](SEPTEMBER_24).map((record) => toKey(record.day));

      expect(new Set(keys).size).toBe(keys.length);
      expect(keys.every((key) => key < toKey(SEPTEMBER_24))).toBe(true);
    },
  );

  it.for(Object.keys(SCENARIOS).filter(isScenarioName))(
    '%s: 실패 태그가 하루 2개 이하이고 공백이 없다(기록 폼 규칙)',
    (name) => {
      const records = SCENARIOS[name](SEPTEMBER_24);

      expect(records.every((record) => record.fail_tags.length <= 2)).toBe(true);
      expect(records.flatMap((record) => record.fail_tags).some((tag) => /\s/.test(tag))).toBe(false);
    },
  );
});

const SEPTEMBER_24 = toDay('2026-09-24');
const JANUARY_15 = toDay('2027-01-15');
const OCTOBER_10 = toDay('2026-10-10');
const AUGUST_15_TO_SEPTEMBER_23 = 40;
const PRODUCTION_RECORD_COUNT = 620;
const MANY_TAGS_THRESHOLD = 10;
const DATE_LIMITS: {name: ScenarioName; accepted: string; rejected: string; message: string}[] = [
  {name: 'streak', accepted: '2026-10-02', rejected: '2026-10-01', message: '2일 이후'},
  {name: 'no-fail', accepted: '2026-10-02', rejected: '2026-10-01', message: '2일 이후'},
  {name: 'first-day', accepted: '2026-10-02', rejected: '2026-10-01', message: '2일 이후'},
  {name: 'three-days', accepted: '2026-09-04', rejected: '2026-09-03', message: '4일 이후'},
  {name: 'fail-compare', accepted: '2026-09-05', rejected: '2026-09-04', message: '5일 이후'},
  {name: 'tag-detail', accepted: '2026-09-07', rejected: '2026-09-06', message: '7일 이후'},
];

function toDay(key: string): SimpleDate {
  const [year, month, date] = key.split('-').map(Number);
  return {year, month, date};
}

function toKey({year, month, date}: SimpleDate) {
  return [String(year), String(month).padStart(2, '0'), String(date).padStart(2, '0')].join('-');
}

function isInMonth(record: SeedRecord, monthKey: string) {
  return toKey(record.day).startsWith(`${monthKey}-`);
}

function countByMonth(records: SeedRecord[], monthKey: string) {
  return records.filter((record) => isInMonth(record, monthKey)).length;
}

function countByMonths(records: SeedRecord[], monthKeys: string[]) {
  return Object.fromEntries(monthKeys.map((monthKey) => [monthKey, countByMonth(records, monthKey)]));
}

function countTagByMonths(records: SeedRecord[], tag: string, monthKeys: string[]) {
  return Object.fromEntries(
    monthKeys.map((monthKey) => [
      monthKey,
      records.filter((record) => isInMonth(record, monthKey) && record.fail_tags.includes(tag)).length,
    ]),
  );
}

function countCurrentStreak(records: SeedRecord[], base: SimpleDate) {
  let count = 0;
  for (let day = addDays(base, -1); hasRecord(records, day); day = addDays(day, -1)) {
    count++;
  }
  return count;
}

function countLongestStreak(records: SeedRecord[]) {
  return Math.max(...records.map((record) => countCurrentStreak(records, addDays(record.day, 1))));
}

function findRecord(records: SeedRecord[], day: SimpleDate) {
  return records.find((record) => isSameDay(record.day, day));
}

function hasRecord(records: SeedRecord[], day: SimpleDate) {
  return findRecord(records, day) !== undefined;
}

function isSameDay(left: SimpleDate, right: SimpleDate) {
  return toKey(left) === toKey(right);
}
