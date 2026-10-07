import {describe, expect, it} from 'vitest';
import {validateDate, validateNewStudyRecord, validateNotFutureMonth} from './validate';

const TODAY = '2026-09-24';

function createBody(date: string) {
  return {date, dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: []};
}

describe('validateNewStudyRecord()', () => {
  describe('Boundary cases', () => {
    it('오늘 날짜 기록은 받아야 한다', () => {
      expect(validateNewStudyRecord(createBody(TODAY), TODAY)).toMatchObject({ok: true, value: {date: TODAY}});
    });

    it('내일 날짜 기록은 거절해야 한다', () => {
      expect(validateNewStudyRecord(createBody('2026-09-25'), TODAY)).toEqual({
        ok: false,
        rejection: {code: 'INVALID_DATE', message: '오늘과 지난 날짜만 기록할 수 있어요'},
      });
    });
  });
});

describe('validateDate()', () => {
  describe('Boundary cases', () => {
    it('오늘 날짜는 받아야 한다', () => {
      expect(validateDate(TODAY, TODAY)).toEqual({ok: true, value: TODAY});
    });

    it('내일 날짜는 거절해야 한다', () => {
      expect(validateDate('2026-09-25', TODAY)).toEqual({
        ok: false,
        rejection: {code: 'INVALID_DATE', message: '오늘과 지난 날짜만 조회할 수 있어요'},
      });
    });
  });
});

describe('validateNotFutureMonth()', () => {
  describe('Boundary cases', () => {
    it('오늘이 그 달 1일이면 그 달을 받아야 한다', () => {
      const firstDay = '2026-09-01';
      const month = {from: firstDay, until: '2026-10-01'};

      expect(validateNotFutureMonth(month, firstDay)).toEqual({ok: true, value: month});
    });

    it('오늘이 말일이면 다음 달을 거절해야 한다', () => {
      expect(validateNotFutureMonth({from: '2026-10-01', until: '2026-11-01'}, '2026-09-30')).toEqual({
        ok: false,
        rejection: {code: 'INVALID_MONTH', message: '미래 달은 조회할 수 없어요'},
      });
    });
  });
});
