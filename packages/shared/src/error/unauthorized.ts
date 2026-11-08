import {ApiResponseError} from '@developer-choi/utils/api';

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiResponseError && error.status === UNAUTHORIZED_STATUS;
}

const UNAUTHORIZED_STATUS = 401;
