import {describe, expect, it} from 'vitest';
import type {z} from 'zod';
import {STUDY_RECORD_FIELD_LIMITS, STUDY_RECORD_FIELD_MESSAGES} from './limits';
import {
  checkLookupDate,
  checkNewStudyRecord,
  checkNotFutureMonth,
  checkStudyRecordUpdate,
  dateSchema,
  monthSchema,
  type NewStudyRecord,
  newStudyRecordSchema,
  RECORD_REJECTION_CODES,
  type Rejection,
  toRejection,
} from './validate';

describe('checkNewStudyRecord()', () => {
  describe('General cases', () => {
    it('공부시간이 있는 오늘 기록이면 null을 반환해야 한다', () => {
      expect(checkNewStudyRecord(createRecord(TODAY, [MORNING_MINUTES, 0, 0]), TODAY)).toBeNull();
    });

    it('실패 태그만 있으면 null을 반환해야 한다', () => {
      const record = {...createRecord(TODAY, [0, 0, 0]), failTags: ['늦잠']};

      expect(checkNewStudyRecord(record, TODAY)).toBeNull();
    });

    it('공부시간이 모두 0이고 실패 태그가 없으면 빈 기록으로 거절해야 한다', () => {
      expect(checkNewStudyRecord(createRecord(TODAY, [0, 0, 0]), TODAY)).toEqual(EMPTY_RECORD_REJECTION);
    });

    describe('휴일이면', () => {
      it('빈 기록일 때 빈 기록으로 거절해야 한다', () => {
        const record = {...createRecord(TODAY, [0, 0, 0]), dateType: 'holiday' as const};

        expect(checkNewStudyRecord(record, TODAY)).toEqual(EMPTY_RECORD_REJECTION);
      });
    });
  });

  describe('Boundary cases', () => {
    it('내일 날짜 기록이면 날짜로 거절해야 한다', () => {
      expect(checkNewStudyRecord(createRecord(TOMORROW, [MORNING_MINUTES, 0, 0]), TODAY)).toEqual({
        code: 'INVALID_DATE',
        message: '오늘과 지난 날짜만 기록할 수 있어요',
      });
    });
  });

  describe('Edge cases', () => {
    describe('내일 날짜면', () => {
      it('빈 기록일 때 빈 기록으로 거절해야 한다', () => {
        expect(checkNewStudyRecord(createRecord(TOMORROW, [0, 0, 0]), TODAY)).toEqual(EMPTY_RECORD_REJECTION);
      });
    });
  });
});

describe('newStudyRecordSchema', () => {
  describe('Boundary cases', () => {
    [
      {failTag: '여섯글자태그', reason: '6글자 실패 태그'},
      {failTag: '😀😀😀😀😀😀', reason: '이모지 6개 실패 태그'},
    ].forEach(({failTag, reason}) => {
      it(`${reason}는 받아야 한다`, () => {
        const result = newStudyRecordSchema.safeParse({...createBody(TODAY), failTags: [failTag]});

        expect(result.data?.failTags).toEqual([failTag]);
      });
    });

    it('7글자 실패 태그는 글자 수 문구로 거절해야 한다', () => {
      const result = newStudyRecordSchema.safeParse({...createBody(TODAY), failTags: ['일곱글자의태그']});

      expect(readFirstIssueMessage(result)).toBe(STUDY_RECORD_FIELD_MESSAGES.failTagLength);
    });
  });
});

describe('checkStudyRecordUpdate()', () => {
  describe('General cases', () => {
    it('기존 기록을 빈 기록으로 고치면 빈 기록으로 거절해야 한다', () => {
      expect(checkStudyRecordUpdate({dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: []})).toEqual(
        EMPTY_RECORD_REJECTION,
      );
    });

    it('실패 태그만 남기고 고치면 null을 반환해야 한다', () => {
      expect(checkStudyRecordUpdate({dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: ['늦잠']})).toBeNull();
    });
  });
});

describe('checkLookupDate()', () => {
  describe('Boundary cases', () => {
    it('오늘 날짜면 null을 반환해야 한다', () => {
      expect(checkLookupDate(TODAY, TODAY)).toBeNull();
    });

    it('내일 날짜면 조회 날짜 문구로 거절해야 한다', () => {
      expect(checkLookupDate(TOMORROW, TODAY)).toEqual({
        code: 'INVALID_DATE',
        message: '오늘과 지난 날짜만 조회할 수 있어요',
      });
    });
  });
});

describe('dateSchema', () => {
  describe('Edge cases', () => {
    [
      {date: null, reason: '날짜가 없는 요청'},
      {date: '2026-13-01', reason: '13월'},
      {date: '2026-02-30', reason: '없는 날'},
      {date: '2026-9-24', reason: '앞에 0이 빠진 달'},
    ].forEach(({date, reason}) => {
      it(`${reason}이면 날짜 형식 문구로 거절해야 한다`, () => {
        expect(readFirstIssueMessage(dateSchema.safeParse(date))).toBe('날짜가 올바르지 않아요');
      });
    });
  });
});

describe('monthSchema', () => {
  describe('General cases', () => {
    it('달을 그 달 1일부터 다음 달 1일 전까지의 범위로 바꿔야 한다', () => {
      expect(monthSchema.safeParse('2026-09').data).toEqual({from: '2026-09-01', until: '2026-10-01'});
    });
  });

  describe('Edge cases', () => {
    [
      {month: null, reason: '달이 없는 요청'},
      {month: '2026-13', reason: '13월'},
      {month: '2026-9', reason: '앞에 0이 빠진 달'},
    ].forEach(({month, reason}) => {
      it(`${reason}이면 달 형식 문구로 거절해야 한다`, () => {
        expect(readFirstIssueMessage(monthSchema.safeParse(month))).toBe('조회할 달이 올바르지 않아요');
      });
    });
  });
});

describe('checkNotFutureMonth()', () => {
  describe('Boundary cases', () => {
    it('오늘이 그 달 1일이면 null을 반환해야 한다', () => {
      const firstDay = '2026-09-01';

      expect(checkNotFutureMonth({from: firstDay, until: '2026-10-01'}, firstDay)).toBeNull();
    });

    it('오늘이 말일이면 다음 달을 미래 달 문구로 거절해야 한다', () => {
      expect(checkNotFutureMonth({from: '2026-10-01', until: '2026-11-01'}, '2026-09-30')).toEqual({
        code: 'INVALID_MONTH',
        message: '미래 달은 조회할 수 없어요',
      });
    });
  });
});

describe('RECORD_REJECTION_CODES', () => {
  describe('General cases', () => {
    it('새 기록 검증이 거절하며 낼 수 있는 code와 같아야 한다', () => {
      const body = createBody(TODAY);
      const tooLongFailTag = '가'.repeat(STUDY_RECORD_FIELD_LIMITS.failTags.maxLength + 1);
      const rejectedBodies = [
        null,
        {...body, date: '2026-13-01'},
        {...body, dateType: 'workday'},
        {...body, studiedMinutes: [-1, 0, 0]},
        {...body, failTags: [tooLongFailTag]},
        {...body, studiedMinutes: [0, 0, 0]},
      ];

      const codes = rejectedBodies.map((rejectedBody) => rejectNewStudyRecord(rejectedBody)?.code);

      expect(new Set(codes)).toEqual(new Set(RECORD_REJECTION_CODES));
    });
  });
});

describe('toRejection()', () => {
  describe('General cases', () => {
    [
      {field: 'date', code: 'INVALID_DATE'},
      {field: 'dateType', code: 'INVALID_DATE_TYPE'},
      {field: 'studiedMinutes', code: 'INVALID_STUDIED_MINUTES'},
      {field: 'failTags', code: 'INVALID_FAIL_TAGS'},
      {field: 'month', code: 'INVALID_MONTH'},
    ].forEach(({field, code}) => {
      it(`첫 문제가 ${field} 칸이면 ${code}와 그 문제의 문구를 반환해야 한다`, () => {
        expect(toRejection([{message: '문구', path: [field, 0]}])).toEqual({code, message: '문구'});
      });
    });

    it('경로가 key를 가진 객체로 와도 그 칸의 code를 반환해야 한다', () => {
      expect(toRejection([{message: '문구', path: [{key: 'month'}]}])).toEqual({
        code: 'INVALID_MONTH',
        message: '문구',
      });
    });
  });

  describe('Edge cases', () => {
    [
      {issues: [], reason: '빈 문제 목록'},
      {issues: [{message: '문구'}], reason: '경로가 없는 문제'},
      {issues: [{message: '문구', path: ['extra']}], reason: '기록에 없는 칸의 문제'},
    ].forEach(({issues, reason}) => {
      it(`${reason}이면 요청 형식 문구로 INVALID_BODY를 반환해야 한다`, () => {
        expect(toRejection(issues)).toEqual({code: 'INVALID_BODY', message: '요청 형식이 올바르지 않아요'});
      });
    });
  });
});

const TODAY = '2026-09-24';
const TOMORROW = '2026-09-25';
const EMPTY_RECORD_REJECTION = {code: 'EMPTY_RECORD', message: STUDY_RECORD_FIELD_MESSAGES.emptyRecord};
const MORNING_MINUTES = 30;

function createBody(date: string) {
  return {date, dateType: 'weekday', studiedMinutes: [MORNING_MINUTES, 0, 0], failTags: []};
}

function createRecord(date: string, studiedMinutes: NewStudyRecord['studiedMinutes']): NewStudyRecord {
  return {date, dateType: 'weekday', studiedMinutes, failTags: []};
}

/**
 * undefined: 검증을 통과했다
 */
function readFirstIssueMessage(result: z.ZodSafeParseResult<unknown>): string | undefined {
  return result.error?.issues[0]?.message;
}

/**
 * null: 받을 수 있는 기록이다
 */
function rejectNewStudyRecord(body: unknown): Rejection | null {
  const result = newStudyRecordSchema.safeParse(body);
  return result.success ? checkNewStudyRecord(result.data, TODAY) : toRejection(result.error.issues);
}
