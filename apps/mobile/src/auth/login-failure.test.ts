import {describe, expect, it} from '@jest/globals';
import {ApiRequestError, ApiResponseError} from '@developer-choi/utils/api';
import {getLoginFailure} from './login-failure';

describe('getLoginFailure()', () => {
  describe('General cases', () => {
    it('게스트 한도 때문에 거절당하면 게스트 시작이 막힌 실패를 반환해야 한다', () => {
      const error = createResponseError(TOO_MANY_REQUESTS_STATUS, {code: 'guest_limit', message: '막았어요'});

      expect(getLoginFailure(error)).toBe('guest-limit');
    });

    it('서버 오류면 로그인 실패를 반환해야 한다', () => {
      const error = createResponseError(INTERNAL_SERVER_ERROR_STATUS, null);

      expect(getLoginFailure(error)).toBe('failed');
    });
  });

  describe('Edge cases', () => {
    it('게스트 한도 때문이 아닌 거절이면 일반 로그인 실패를 반환해야 한다', () => {
      const error = createResponseError(TOO_MANY_REQUESTS_STATUS, {code: 'other', message: '막았어요'});

      expect(getLoginFailure(error)).toBe('failed');
    });

    it('요청이 서버에 닿지 못하면 로그인 실패를 반환해야 한다', () => {
      const error = new ApiRequestError({method: 'POST', url: GUEST_TOKEN_URL});

      expect(getLoginFailure(error)).toBe('failed');
    });
  });
});

const TOO_MANY_REQUESTS_STATUS = 429;
const INTERNAL_SERVER_ERROR_STATUS = 500;
const GUEST_TOKEN_URL = 'http://localhost/api/app-token/guest';

function createResponseError(status: number, errorData: unknown) {
  return new ApiResponseError({method: 'POST', status, url: GUEST_TOKEN_URL, errorData});
}
