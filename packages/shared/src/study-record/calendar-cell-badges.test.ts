import {describe, expect, it} from 'vitest';
import {getCalendarCellBadges} from './calendar-cell-badges';
import type {StudyRecord} from './type';

describe('getCalendarCellBadges()', () => {
  describe('General cases', () => {
    it('그날 공부시간을 모두 더한 시간을 시:분 글자로 반환해야 한다', () => {
      const morningMinutes = 90;
      const afternoonMinutes = 60;
      const record = createRecord({studiedMinutes: [morningMinutes, afternoonMinutes, 0]});

      expect(getCalendarCellBadges(record).studiedTime).toBe('2:30');
    });

    it('실패 태그가 세 개면 앞의 두 개만 반환해야 한다', () => {
      const record = createRecord({failTags: ['피곤', '늦잠', '게임']});

      expect(getCalendarCellBadges(record).failTags).toEqual(['피곤', '늦잠']);
    });
  });

  describe('Boundary cases', () => {
    describe('그날 공부시간 합계가 0분이면', () => {
      const failTags = ['피곤'];
      const record = createRecord({studiedMinutes: [0, 0, 0], failTags});

      it('공부시간 뱃지 글자로 null을 반환해야 한다', () => {
        expect(getCalendarCellBadges(record).studiedTime).toBeNull();
      });

      it('실패 태그가 있으면 그 태그를 반환해야 한다', () => {
        expect(getCalendarCellBadges(record).failTags).toEqual(failTags);
      });
    });

    it('실패 태그가 정확히 두 개면 두 개 모두 반환해야 한다', () => {
      const failTags = ['피곤', '늦잠'];
      const record = createRecord({failTags});

      expect(getCalendarCellBadges(record).failTags).toEqual(failTags);
    });
  });

  describe('Edge cases', () => {
    it('그날 기록이 없으면 뱃지를 하나도 반환하지 않아야 한다', () => {
      expect(getCalendarCellBadges(undefined)).toEqual({studiedTime: null, failTags: []});
    });
  });
});

function createRecord(fields: Partial<Pick<StudyRecord, 'studiedMinutes' | 'failTags'>>): StudyRecord {
  return {
    pk: 1,
    date: '2026-10-03',
    dateType: 'weekday',
    studiedMinutes: [0, 0, 0],
    failTags: [],
    ...fields,
  };
}
