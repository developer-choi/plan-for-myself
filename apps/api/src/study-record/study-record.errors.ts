import {API_ERROR_CODES, type ApiErrorBody} from '@plan-for-myself/shared/error';

export const RECORD_NOT_FOUND: ApiErrorBody = {code: API_ERROR_CODES.NOT_FOUND, message: '기록을 찾을 수 없어요'};

export const DUPLICATE_DATE: ApiErrorBody = {
  code: API_ERROR_CODES.DUPLICATE_DATE,
  message: '이 날짜엔 이미 기록이 있어요',
};
