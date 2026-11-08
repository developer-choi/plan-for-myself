import {ApiRequestError, ApiResponseError, HTTP_STATUS} from '@developer-choi/utils/api';

export function isTransientApiError(error: unknown): boolean {
  return (
    error instanceof ApiRequestError || (error instanceof ApiResponseError && error.status >= HTTP_STATUS.SERVER_ERROR)
  );
}
