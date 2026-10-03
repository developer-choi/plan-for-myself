import {NextResponse} from 'next/server';
import type {Rejection} from './validate';

export interface ApiRejection {
  code: Rejection['code'] | 'UNAUTHORIZED' | 'NOT_FOUND' | 'DUPLICATE_DATE';
  message: string;
}

export function createdResponse(body: unknown) {
  return NextResponse.json(body, {status: HTTP_STATUS.CREATED});
}

export function noContentResponse() {
  return new NextResponse(null, {status: HTTP_STATUS.NO_CONTENT});
}

export function badRequestResponse(rejection: Rejection) {
  return rejectResponse(HTTP_STATUS.BAD_REQUEST, rejection);
}

export function unauthorizedResponse() {
  return rejectResponse(HTTP_STATUS.UNAUTHORIZED, {code: 'UNAUTHORIZED', message: '로그인이 필요해요'});
}

/* 남의 기록도 없는 기록과 같이 404로 답한다. 403이면 그 pk의 기록이 있다는 것을 알려 주게 된다 */
export function notFoundResponse() {
  return rejectResponse(HTTP_STATUS.NOT_FOUND, {code: 'NOT_FOUND', message: '기록을 찾을 수 없어요'});
}

export function duplicateDateResponse() {
  return rejectResponse(HTTP_STATUS.CONFLICT, {code: 'DUPLICATE_DATE', message: '이 날짜엔 이미 기록이 있어요'});
}

const HTTP_STATUS = {CREATED: 201, NO_CONTENT: 204, BAD_REQUEST: 400, UNAUTHORIZED: 401, NOT_FOUND: 404, CONFLICT: 409};

function rejectResponse(status: number, rejection: ApiRejection) {
  return NextResponse.json(rejection, {status});
}
