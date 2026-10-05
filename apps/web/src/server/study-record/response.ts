import {HTTP_STATUS, rejectResponse} from '@/server/response';
import type {Rejection} from './validate';

export function badRequestResponse(rejection: Rejection) {
  return rejectResponse(HTTP_STATUS.BAD_REQUEST, rejection);
}

/* 남의 기록도 없는 기록과 같이 404로 답한다. 403이면 그 pk의 기록이 있다는 것을 알려 주게 된다 */
export function notFoundResponse() {
  return rejectResponse(HTTP_STATUS.NOT_FOUND, {code: 'NOT_FOUND', message: '기록을 찾을 수 없어요'});
}

export function duplicateDateResponse() {
  return rejectResponse(HTTP_STATUS.CONFLICT, {code: 'DUPLICATE_DATE', message: '이 날짜엔 이미 기록이 있어요'});
}
