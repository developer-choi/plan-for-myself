import {describe, expect, it} from 'vitest';
import {getCalendarDayCells} from './calendar-day-cells';
import {minutesFormat} from './format';
import type {StudyRecord} from './type';

describe('getCalendarDayCells()', () => {
  describe('General cases', () => {
    it('기록이 있는 날은 그 기록을 담아야 한다', () => {
      const record = createRecord({date: '2026-11-03', studiedMinutes: [STUDIED_MINUTES, 0, 0], failTags: []});

      expect(findCell('2026-11-03', [record])?.record).toBe(record);
    });

    it('기록이 있는 날은 그 기록의 공부시간과 실패 태그를 배지로 담아야 한다', () => {
      const record = createRecord({date: '2026-11-03', studiedMinutes: [STUDIED_MINUTES, 0, 0], failTags: ['늦잠']});

      expect(findCell('2026-11-03', [record])).toMatchObject({
        studiedTime: minutesFormat(STUDIED_MINUTES),
        failTags: ['늦잠'],
      });
    });

    it('기록이 없는 날은 record가 undefined여야 한다', () => {
      expect(findCell('2026-11-04', [])?.record).toBeUndefined();
    });

    it('기록이 없는 날은 배지가 비어야 한다', () => {
      expect(findCell('2026-11-04', [])).toMatchObject({studiedTime: null, failTags: []});
    });
  });

  describe('Boundary cases', () => {
    it('오늘 칸만 isToday여야 한다', () => {
      const todayDates = getCalendarDayCells(MONTH, TODAY, [])
        .filter((cell) => cell.isToday)
        .map((cell) => cell.date);

      expect(todayDates).toEqual([TODAY]);
    });

    it('오늘 다음 날부터 미래여야 한다', () => {
      const firstFutureCell = getCalendarDayCells(MONTH, TODAY, []).find((cell) => cell.isFuture);

      expect(firstFutureCell?.date).toBe('2026-11-11');
    });
  });
});

function findCell(date: string, records: StudyRecord[]) {
  return getCalendarDayCells(MONTH, TODAY, records).find((cell) => cell.date === date);
}

function createRecord(overrides: Pick<StudyRecord, 'date' | 'studiedMinutes' | 'failTags'>): StudyRecord {
  return {pk: 1, dateType: 'weekday', ...overrides};
}

const MONTH = {year: 2026, month: 11};
const TODAY = '2026-11-10';
const STUDIED_MINUTES = 30;
