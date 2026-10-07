import {describe, expect, it} from 'vitest';
import {validateNewStudyRecord} from './validate';

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
