import {ApiResponseError} from '@developer-choi/utils/api';
import type {FieldErrors} from 'react-hook-form';
import {z} from 'zod';
import {API_ERROR_CODES} from '@plan-for-myself/shared/error';
import {isHolidayDate} from '../date/holiday';
import {parseDateParam} from '../date/month-param';
import {STUDY_RECORD_FIELD_LIMITS, STUDY_RECORD_FIELD_MESSAGES} from './limits';
import type {StudyRecord, StudyRecordFieldsRequest} from './type';

export type MinuteSlot = 'morning' | 'afternoon' | 'evening';

export interface RecordFormValues {
  holiday: boolean;
  failTags: string[];
  minutes: Record<MinuteSlot, string>;
  failTagInput: string;
}

type AddFailTagResult = {ok: true; failTags: string[]} | {ok: false; message: string};

interface RecordRejection {
  message: string;
  isStale: boolean;
}

export function validateMinuteInput(text: string): true | string {
  const minutes = Number(text);
  const isValid =
    /^\d*$/.test(text.trim()) &&
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

  return {
    holiday: isHolidayDate(parseDateParam(date)),
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

  if ([...tag].length > STUDY_RECORD_FIELD_LIMITS.failTags.maxLength) {
    return {ok: false, message: STUDY_RECORD_FIELD_MESSAGES.failTagLength};
  }

  if (failTags.includes(tag)) {
    return {ok: false, message: FAIL_TAG_DUPLICATE_MESSAGE};
  }

  if (failTags.length >= STUDY_RECORD_FIELD_LIMITS.failTags.maxCount) {
    return {ok: false, message: STUDY_RECORD_FIELD_MESSAGES.failTagCount};
  }

  return {ok: true, failTags: [...failTags, tag]};
}

export function addPendingFailTag(failTags: string[], input: string): AddFailTagResult {
  if (failTags.includes(input.trim())) {
    return {ok: true, failTags};
  }

  return addFailTag(failTags, input);
}

/* 공부시간 칸이 모두 올바르면 undefined */
export function getMinutesError(errors: FieldErrors<RecordFormValues>): string | undefined {
  return MINUTE_SLOTS.map(({slot}) => errors.minutes?.[slot]?.message).find(Boolean);
}

export function parseRecordRejection(error: unknown): RecordRejection | null {
  if (!(error instanceof ApiResponseError)) {
    return null;
  }

  const body = rejectionBodySchema.safeParse(error.errorData);
  if (!body.success) {
    return null;
  }

  return {message: body.data.message, isStale: STALE_REJECTION_CODES.includes(body.data.code)};
}

export const UNEXPECTED_FAILURE_MESSAGE = '저장하지 못했어요. 잠시 후 다시 시도해 주세요';

export const UNEXPECTED_DELETE_FAILURE_MESSAGE = '삭제하지 못했어요. 잠시 후 다시 시도해 주세요';

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

const STALE_REJECTION_CODES: readonly string[] = [API_ERROR_CODES.DUPLICATE_DATE, API_ERROR_CODES.NOT_FOUND];
