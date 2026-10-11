import {ApiResponseError} from '@developer-choi/utils/api';
import type {StudyRecord} from '@plan-for-myself/shared';
import {isHolidayDate, STUDY_RECORD_FIELD_LIMITS, STUDY_RECORD_FIELD_MESSAGES} from '@plan-for-myself/shared';
import {z} from 'zod';
import type {StudyRecordFieldsRequest} from '@/study-record/api';

export type MinuteSlot = 'morning' | 'afternoon' | 'evening';

export interface RecordFormValues {
  holiday: boolean;
  failTags: string[];
  minutes: Record<MinuteSlot, string>;
  failTagInput: string;
}

export type AddFailTagResult = {ok: true; failTags: string[]} | {ok: false; message: string};

export interface RecordRejection {
  message: string;
  isStale: boolean;
}

export function validateMinuteInput(text: string): true | string {
  const minutes = Number(text);
  const isValid =
    /^\d*$/.test(text) &&
    minutes >= STUDY_RECORD_FIELD_LIMITS.studiedMinutes.min &&
    minutes <= STUDY_RECORD_FIELD_LIMITS.studiedMinutes.max;
  return isValid || STUDY_RECORD_FIELD_MESSAGES.studiedMinutes;
}

export function getRecordFormDefaultValues(date: string, record?: StudyRecord): RecordFormValues {
  if (record) {
    const [morning, afternoon, evening] = record.studiedMinutes;
    return {
      holiday: record.dateType === 'holiday',
      failTags: record.failTags,
      minutes: {morning: String(morning), afternoon: String(afternoon), evening: String(evening)},
      failTagInput: '',
    };
  }

  const [year, month, day] = date.split('-').map(Number);
  return {
    holiday: isHolidayDate({year, month, date: day}),
    failTags: [],
    minutes: {morning: '', afternoon: '', evening: ''},
    failTagInput: '',
  };
}

export function toStudyRecordFields({holiday, failTags, minutes}: RecordFormValues): StudyRecordFieldsRequest {
  return {
    dateType: holiday ? 'holiday' : 'weekday',
    studiedMinutes: [Number(minutes.morning), Number(minutes.afternoon), Number(minutes.evening)],
    failTags,
  };
}

export function addFailTag(failTags: string[], input: string): AddFailTagResult {
  const tag = input.trim();

  if (!tag) {
    return {ok: true, failTags};
  }

  if (/\s/.test(tag)) {
    return {ok: false, message: STUDY_RECORD_FIELD_MESSAGES.failTagSpace};
  }

  if (failTags.includes(tag)) {
    return {ok: false, message: FAIL_TAG_DUPLICATE_MESSAGE};
  }

  if (failTags.length >= STUDY_RECORD_FIELD_LIMITS.failTags.maxCount) {
    return {ok: false, message: STUDY_RECORD_FIELD_MESSAGES.failTagCount};
  }

  return {ok: true, failTags: [...failTags, tag]};
}

export function parseRecordRejection(error: unknown): RecordRejection | null {
  if (!(error instanceof ApiResponseError)) {
    return null;
  }

  const body = rejectionBodySchema.safeParse(error.errorData);
  if (!body.success) {
    return null;
  }

  return {message: body.data.message, isStale: STALE_REJECTION_STATUSES.includes(error.status)};
}

export const UNEXPECTED_FAILURE_MESSAGE = '저장하지 못했어요. 잠시 뒤 다시 시도해 주세요';

export const UNEXPECTED_DELETE_FAILURE_MESSAGE = '지우지 못했어요. 잠시 뒤 다시 시도해 주세요';

export const FAIL_TAG_DUPLICATE_MESSAGE = '이미 넣은 실패 태그예요';

export const MINUTE_SLOTS: {slot: MinuteSlot; label: string}[] = [
  {slot: 'morning', label: '아침'},
  {slot: 'afternoon', label: '점심'},
  {slot: 'evening', label: '저녁'},
];

const rejectionBodySchema = z.object({
  code: z.string({error: '거절 코드가 없어요'}),
  message: z.string({error: '거절 문구가 없어요'}),
});

const DUPLICATE_DATE_STATUS = 409;
const NOT_FOUND_STATUS = 404;
const STALE_REJECTION_STATUSES = [DUPLICATE_DATE_STATUS, NOT_FOUND_STATUS];
