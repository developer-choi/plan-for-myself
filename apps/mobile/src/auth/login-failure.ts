import {hasGuestLimitCode, type LoginFailure} from '@plan-for-myself/shared';
import {ApiResponseError} from '@developer-choi/utils/api';

export function getLoginFailure(error: unknown): LoginFailure {
  if (error instanceof ApiResponseError && hasGuestLimitCode(error.errorData)) {
    return 'guest-limit';
  }
  return 'failed';
}
