import {NextResponse} from 'next/server';

export interface ApiRejection {
  code: string;
  message: string;
}

export function createdResponse(body: unknown) {
  return NextResponse.json(body, {status: HTTP_STATUS.CREATED});
}

export function noContentResponse() {
  return new NextResponse(null, {status: HTTP_STATUS.NO_CONTENT});
}

export function unauthorizedResponse() {
  return rejectResponse(HTTP_STATUS.UNAUTHORIZED, {code: 'UNAUTHORIZED', message: '로그인이 필요해요'});
}

export function rejectResponse(status: number, rejection: ApiRejection) {
  return NextResponse.json(rejection, {status});
}

export const HTTP_STATUS = {
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
};
