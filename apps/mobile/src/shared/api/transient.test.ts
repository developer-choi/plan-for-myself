import {describe, expect, it} from '@jest/globals';
import {ApiRequestError, ApiResponseError, HTTP_STATUS} from '@developer-choi/utils/api';
import {isTransientApiError} from './transient';

const UNAUTHORIZED_STATUS = 401;
const BAD_GATEWAY_STATUS = 502;
const JUST_BELOW_SERVER_ERROR_STATUS = 499;

describe('isTransientApiError()', () => {
  describe('General cases', () => {
    it('요청이 서버에 닿지 못하면 true를 반환해야 한다', () => {
      const error = new ApiRequestError({method: 'POST', url: APP_TOKEN_REFRESH_URL});

      expect(isTransientApiError(error)).toBe(true);
    });
  });

  describe('Boundary cases', () => {
    it.each([HTTP_STATUS.SERVER_ERROR, BAD_GATEWAY_STATUS])(
      'API가 서버 오류 상태 %d를 주면 true를 반환해야 한다',
      (status) => {
        const error = new ApiResponseError({method: 'POST', status, url: APP_TOKEN_REFRESH_URL, errorData: null});

        expect(isTransientApiError(error)).toBe(true);
      },
    );

    it.each([UNAUTHORIZED_STATUS, HTTP_STATUS.UNPROCESSABLE, JUST_BELOW_SERVER_ERROR_STATUS])(
      'API가 서버 오류가 아닌 상태 %d를 주면 false를 반환해야 한다',
      (status) => {
        const error = new ApiResponseError({method: 'POST', status, url: APP_TOKEN_REFRESH_URL, errorData: null});

        expect(isTransientApiError(error)).toBe(false);
      },
    );
  });

  describe('Edge cases', () => {
    it('API 오류가 아닌 일반 에러면 false를 반환해야 한다', () => {
      expect(isTransientApiError(new Error('저장소 실패'))).toBe(false);
    });

    describe('서버 오류 상태를 가졌어도', () => {
      it('API 오류가 아닌 객체면 false를 반환해야 한다', () => {
        expect(isTransientApiError({status: HTTP_STATUS.SERVER_ERROR})).toBe(false);
      });
    });

    it.each([null, undefined, '요청 실패'])('에러가 아닌 값 %p이면 false를 반환해야 한다', (value) => {
      expect(isTransientApiError(value)).toBe(false);
    });
  });
});

const APP_TOKEN_REFRESH_URL = '/api/app-token/refresh';
