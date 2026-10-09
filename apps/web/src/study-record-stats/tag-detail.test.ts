import type {FailureTagTrend, StudyRecord} from '@plan-for-myself/shared';
import {describe, expect, it} from 'vitest';
import {getTagCalendar, toTrendBars, type TagCalendarData} from './tag-detail';

describe('toTrendBars()', () => {
  describe('Boundary cases', () => {
    it('추이가 비어 있으면 빈 배열을 반환해야 한다', () => {
      expect(toTrendBars([])).toEqual([]);
    });

    it('해가 바뀌는 추이의 라벨은 연도 없이 「12월」「1월」로 반환해야 한다', () => {
      const trend: FailureTagTrend[] = [
        {month: '2025-12', count: 1, previousCount: 0, status: 'repeated'},
        {month: '2026-01', count: 1, previousCount: 1, status: 'repeated'},
      ];

      expect(toTrendBars(trend).map(({label}) => label)).toEqual(['12월', '1월']);
    });
  });
});

describe('getTagCalendar()', () => {
  describe('General cases', () => {
    describe('지난 날', () => {
      it('고른 태그가 적힌 기록의 날은 그 태그가 나온 날로 반환해야 한다', () => {
        const records = [createRecord('2026-09-01', ['늦잠']), createRecord('2026-09-02', ['야식'])];

        const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records, tag: '늦잠'});

        expect(getState(calendar, '2026-09-01')).toBe('hit');
      });

      it('고른 태그가 없는 기록의 날은 기록은 있지만 그 태그는 없는 날로 반환해야 한다', () => {
        const records = [createRecord('2026-09-01', ['늦잠']), createRecord('2026-09-02', ['야식'])];

        const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records, tag: '늦잠'});

        expect(getState(calendar, '2026-09-02')).toBe('recorded');
      });

      it('기록이 없는 지난 날은 기록하지 않은 지난 날로 반환해야 한다', () => {
        const records = [createRecord('2026-09-01', ['늦잠']), createRecord('2026-09-02', ['야식'])];

        const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records, tag: '늦잠'});

        expect(getState(calendar, '2026-09-03')).toBe('missing');
      });
    });

    describe('현재 날짜와 미래 날', () => {
      it('기록하기 전의 현재 날짜는 아직 끝나지 않은 날로 반환해야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records: [], tag: '늦잠'});

        expect(getState(calendar, TODAY)).toBe('inactive');
      });

      it('미래 날은 모두 아직 끝나지 않은 날로 반환해야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records: [], tag: '늦잠'});

        const futureStates = calendar.days.filter(({date}) => date > TODAY).map(({state}) => state);

        expect(new Set(futureStates)).toEqual(new Set(['inactive']));
      });
    });

    describe('2026년 9월', () => {
      it('앞 빈칸은 월요일 시작 기준으로 1칸이어야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records: [], tag: '늦잠'});

        expect(calendar.leadingBlanks).toBe(1);
      });

      it('그 달 날짜만 1일부터 30일까지 반환해야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records: [], tag: '늦잠'});

        expect(calendar.days.map(({date}) => date)).toEqual(SEPTEMBER_DATES);
      });
    });
  });

  describe('Edge cases', () => {
    describe('현재 날짜를 기록했을 때', () => {
      [
        {name: '고른 태그가 있으면', failTags: ['늦잠'], state: 'hit', label: '그 태그가 나온 날'},
        {name: '고른 태그가 없으면', failTags: [], state: 'recorded', label: '기록은 있지만 그 태그는 없는 날'},
      ].forEach(({name, failTags, state, label}) => {
        it(`기록에 ${name} ${label}로 반환해야 한다`, () => {
          const records = [createRecord(TODAY, failTags)];

          const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records, tag: '늦잠'});

          expect(getState(calendar, TODAY)).toBe(state);
        });
      });
    });

    it('기록의 태그 중 하나가 고른 태그면 그날은 그 태그가 나온 날로 반환해야 한다', () => {
      const records = [createRecord('2026-09-01', ['야식', '늦잠', '지각'])];

      const calendar = getTagCalendar({month: SEPTEMBER, today: TODAY, records, tag: '늦잠'});

      expect(getState(calendar, '2026-09-01')).toBe('hit');
    });

    describe('지난 달 조회', () => {
      it('아직 끝나지 않은 날이 없어야 한다', () => {
        const calendar = getTagCalendar({month: AUGUST, today: TODAY, records: [], tag: '늦잠'});

        expect(calendar.days.map(({state}) => state)).not.toContain('inactive');
      });

      it('기록이 없는 마지막 날은 기록하지 않은 지난 날로 반환해야 한다', () => {
        const calendar = getTagCalendar({month: AUGUST, today: TODAY, records: [], tag: '늦잠'});

        expect(getState(calendar, '2026-08-31')).toBe('missing');
      });
    });
  });
});

const TODAY = '2026-09-24';
const SEPTEMBER = {year: 2026, month: 9};
const AUGUST = {year: 2026, month: 8};
const SEPTEMBER_DATES = Array.from({length: 30}, (_unused, index) => `2026-09-${String(index + 1).padStart(2, '0')}`);

function createRecord(date: string, failTags: string[]): StudyRecord {
  return {pk: 1, date, dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags};
}

function getState(calendar: TagCalendarData, date: string) {
  return calendar.days.find((calendarDay) => calendarDay.date === date)?.state;
}
