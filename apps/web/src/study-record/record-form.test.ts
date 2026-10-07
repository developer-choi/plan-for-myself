import {ApiResponseError} from '@developer-choi/utils/api';
import {STUDY_RECORD_FIELD_MESSAGES, type StudyRecord} from '@plan-for-myself/shared';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
  addFailTag,
  FAIL_TAG_DUPLICATE_MESSAGE,
  FAIL_TAG_PENDING_MESSAGE,
  getRecordFormDefaultValues,
  type RecordFormValues,
  parseRecordRejection,
  toStudyRecordFields,
  validateFailTagInput,
  validateMinuteInput,
} from './record-form';

const EMPTY_MINUTES = {morning: '', afternoon: '', evening: ''};

function createValues(overrides: Partial<RecordFormValues> = {}): RecordFormValues {
  return {holiday: false, failTags: [], minutes: EMPTY_MINUTES, failTagInput: '', ...overrides};
}

function createResponseError(status: number, errorData: unknown) {
  return new ApiResponseError({method: 'POST', status, url: '/api/study-records', errorData});
}

describe('getRecordFormDefaultValues()', () => {
  describe('General cases', () => {
    describe('기록이 없는 평일이면', () => {
      const date = '2026-10-07';

      it('평일을 반환해야 한다', () => {
        expect(getRecordFormDefaultValues(date).holiday).toBe(false);
      });

      it('빈 실패 태그 목록을 반환해야 한다', () => {
        expect(getRecordFormDefaultValues(date).failTags).toEqual([]);
      });

      it('세 칸 모두 빈 공부시간을 반환해야 한다', () => {
        expect(getRecordFormDefaultValues(date).minutes).toEqual(EMPTY_MINUTES);
      });
    });

    [
      {label: '토요일', date: '2026-10-10'},
      {label: '일요일', date: '2026-10-11'},
    ].forEach(({label, date}) => {
      it(`기록이 없는 ${label}이면 휴일을 반환해야 한다`, () => {
        expect(getRecordFormDefaultValues(date).holiday).toBe(true);
      });
    });

    it('기존 기록이 있으면 그 기록의 값을 입력칸 글자로 반환해야 한다', () => {
      const failTags = ['영어'];
      const morningMinutes = 90;
      const eveningMinutes = 30;
      const record: StudyRecord = {
        pk: 1,
        date: '2026-10-07',
        dateType: 'holiday',
        studiedMinutes: [morningMinutes, 0, eveningMinutes],
        failTags,
      };

      expect(getRecordFormDefaultValues(record.date, record)).toEqual({
        holiday: true,
        failTags,
        minutes: {morning: String(morningMinutes), afternoon: '0', evening: String(eveningMinutes)},
        failTagInput: '',
      });
    });
  });

  describe('Edge cases', () => {
    describe('오늘이 평일일 때', () => {
      beforeEach(() => {
        vi.setSystemTime(new Date('2026-10-07T12:00:00+09:00'));
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('평일에 공휴일인 날이면 휴일을 반환해야 한다', () => {
        expect(getRecordFormDefaultValues('2026-10-09').holiday).toBe(true);
      });
    });
  });
});

describe('toStudyRecordFields()', () => {
  describe('General cases', () => {
    [
      {label: '휴일', holiday: true, dateType: 'holiday'},
      {label: '평일', holiday: false, dateType: 'weekday'},
    ].forEach(({label, holiday, dateType}) => {
      it(`${label}을 고르면 ${label}을 반환해야 한다`, () => {
        expect(toStudyRecordFields(createValues({holiday})).dateType).toBe(dateType);
      });
    });

    it('공부시간 글자를 분 숫자로 반환해야 한다', () => {
      const morningMinutes = 90;
      const eveningMinutes = 30;
      const minutes = {morning: String(morningMinutes), afternoon: '0', evening: String(eveningMinutes)};

      expect(toStudyRecordFields(createValues({minutes})).studiedMinutes).toEqual([morningMinutes, 0, eveningMinutes]);
    });
  });

  describe('Edge cases', () => {
    it('빈 공부시간 칸은 0분으로 반환해야 한다', () => {
      const morningMinutes = 60;
      const minutes = {morning: String(morningMinutes), afternoon: '', evening: ''};

      expect(toStudyRecordFields(createValues({minutes})).studiedMinutes).toEqual([morningMinutes, 0, 0]);
    });
  });
});

describe('validateMinuteInput()', () => {
  describe('Boundary cases', () => {
    it('1440분을 넘으면 공부시간 문구를 반환해야 한다', () => {
      expect(validateMinuteInput('1441')).toBe(STUDY_RECORD_FIELD_MESSAGES.studiedMinutes);
    });

    it('1440분이면 true를 반환해야 한다', () => {
      expect(validateMinuteInput('1440')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('빈칸이면 true를 반환해야 한다', () => {
      expect(validateMinuteInput('')).toBe(true);
    });

    ['abc', '1.5', '-10'].forEach((text) => {
      it(`${text}이면 공부시간 문구를 반환해야 한다`, () => {
        expect(validateMinuteInput(text)).toBe(STUDY_RECORD_FIELD_MESSAGES.studiedMinutes);
      });
    });
  });
});

describe('validateFailTagInput()', () => {
  describe('General cases', () => {
    it('태그 칸에 글자가 남아 있으면 태그를 넣거나 지우라는 문구를 반환해야 한다', () => {
      expect(validateFailTagInput('영어')).toBe(FAIL_TAG_PENDING_MESSAGE);
    });
  });

  describe('Edge cases', () => {
    [
      {label: '빈 글자', text: ''},
      {label: '공백뿐인 글자', text: '   '},
    ].forEach(({label, text}) => {
      it(`${label}이면 true를 반환해야 한다`, () => {
        expect(validateFailTagInput(text)).toBe(true);
      });
    });
  });
});

describe('addFailTag()', () => {
  describe('General cases', () => {
    it('태그가 없을 때 글자를 넣으면 그 태그 하나를 담은 목록을 반환해야 한다', () => {
      expect(addFailTag([], '영어')).toEqual({ok: true, failTags: ['영어']});
    });

    it('앞뒤에 공백이 있으면 공백을 뗀 태그를 넣은 목록을 반환해야 한다', () => {
      expect(addFailTag([], '  영어  ')).toEqual({ok: true, failTags: ['영어']});
    });
  });

  describe('Edge cases', () => {
    [
      {label: '빈 글자', input: ''},
      {label: '공백뿐인 글자', input: '   '},
    ].forEach(({label, input}) => {
      it(`${label}를 넣으면 넘긴 목록을 그대로 반환해야 한다`, () => {
        const failTags = ['영어'];

        expect(addFailTag(failTags, input)).toEqual({ok: true, failTags});
      });
    });

    it('가운데 공백이 든 글자를 넣으면 공백 거절 문구를 반환해야 한다', () => {
      expect(addFailTag([], '영어 단어')).toEqual({ok: false, message: STUDY_RECORD_FIELD_MESSAGES.failTagSpace});
    });

    it('이미 있는 태그를 넣으면 중복 거절 문구를 반환해야 한다', () => {
      expect(addFailTag(['영어'], '영어')).toEqual({ok: false, message: FAIL_TAG_DUPLICATE_MESSAGE});
    });
  });

  describe('Boundary cases', () => {
    it('태그가 2개일 때 3번째를 넣으면 개수 거절 문구를 반환해야 한다', () => {
      expect(addFailTag(['영어', '수학'], '과학')).toEqual({
        ok: false,
        message: STUDY_RECORD_FIELD_MESSAGES.failTagCount,
      });
    });
  });
});

describe('parseRecordRejection()', () => {
  describe('General cases', () => {
    [
      {status: 409, errorData: {code: 'DUPLICATE_DATE', message: '이 날짜엔 이미 기록이 있어요'}},
      {status: 404, errorData: {code: 'NOT_FOUND', message: '기록을 찾을 수 없어요'}},
    ].forEach(({status, errorData}) => {
      describe(`${status} 거절이면`, () => {
        it('서버가 보낸 거절 문구를 반환해야 한다', () => {
          expect(parseRecordRejection(createResponseError(status, errorData))?.message).toBe(errorData.message);
        });

        it('그 달 기록 목록을 다시 받아야 한다고 반환해야 한다', () => {
          expect(parseRecordRejection(createResponseError(status, errorData))?.isStale).toBe(true);
        });
      });
    });

    describe('400 검증 거절이면', () => {
      const badRequestStatus = 400;
      const message = STUDY_RECORD_FIELD_MESSAGES.studiedMinutes;
      const error = createResponseError(badRequestStatus, {code: 'INVALID_STUDIED_MINUTES', message});

      it('서버가 보낸 거절 문구를 반환해야 한다', () => {
        expect(parseRecordRejection(error)?.message).toBe(message);
      });

      it('그 달 기록 목록을 다시 받지 않아도 된다고 반환해야 한다', () => {
        expect(parseRecordRejection(error)?.isStale).toBe(false);
      });
    });
  });

  describe('Edge cases', () => {
    it('서버 응답이 아닌 오류면 null을 반환해야 한다', () => {
      expect(parseRecordRejection(new Error('network'))).toBeNull();
    });

    it('JSON이 아닌 응답이면 null을 반환해야 한다', () => {
      const serverErrorStatus = 500;

      expect(parseRecordRejection(createResponseError(serverErrorStatus, null))).toBeNull();
    });
  });
});
