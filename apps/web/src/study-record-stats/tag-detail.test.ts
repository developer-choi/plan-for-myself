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
    describe('칸 상태', () => {
      const records = [createRecord('2026-09-01', ['늦잠']), createRecord('2026-09-02', ['야식'])];

      it('고른 태그가 적힌 기록의 날은 그 태그가 나온 날로 반환해야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, records, tag: '늦잠'});

        expect(getState(calendar, '2026-09-01')).toBe('hit');
      });

      it('고른 태그가 없는 기록의 날은 나머지 날로 반환해야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, records, tag: '늦잠'});

        expect(getState(calendar, '2026-09-02')).toBe('none');
      });

      it('기록이 없는 날도 나머지 날로 반환해야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, records, tag: '늦잠'});

        expect(getState(calendar, '2026-09-03')).toBe('none');
      });
    });

    describe('2026년 9월', () => {
      it('앞 빈칸은 월요일 시작 기준으로 1칸이어야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, records: [], tag: '늦잠'});

        expect(calendar.leadingBlanks).toBe(1);
      });

      it('그 달 날짜만 1일부터 30일까지 반환해야 한다', () => {
        const calendar = getTagCalendar({month: SEPTEMBER, records: [], tag: '늦잠'});

        expect(calendar.days.map(({date}) => date)).toEqual(SEPTEMBER_DATES);
      });
    });
  });

  describe('Edge cases', () => {
    it('기록의 태그 중 하나가 고른 태그면 그날은 그 태그가 나온 날로 반환해야 한다', () => {
      const records = [createRecord('2026-09-01', ['야식', '늦잠', '지각'])];

      const calendar = getTagCalendar({month: SEPTEMBER, records, tag: '늦잠'});

      expect(getState(calendar, '2026-09-01')).toBe('hit');
    });

    it('고른 태그가 적힌 날이 없는 달은 모든 날이 나머지 날이어야 한다', () => {
      const records = [createRecord('2026-08-10', ['야식'])];

      const calendar = getTagCalendar({month: AUGUST, records, tag: '늦잠'});

      expect(new Set(calendar.days.map(({state}) => state))).toEqual(new Set(['none']));
    });
  });
});
const SEPTEMBER = {year: 2026, month: 9};
const AUGUST = {year: 2026, month: 8};
const SEPTEMBER_DATES = Array.from({length: 30}, (_unused, index) => `2026-09-${String(index + 1).padStart(2, '0')}`);

function createRecord(date: string, failTags: string[]): StudyRecord {
  return {pk: 1, date, dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags};
}

function getState(calendar: TagCalendarData, date: string) {
  return calendar.days.find((calendarDay) => calendarDay.date === date)?.state;
}
