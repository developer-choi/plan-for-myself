import {describe, expect, it} from 'vitest';
import {ApiResponseError, HTTP_STATUS} from '@developer-choi/utils/api';
import {isUnauthorizedError} from './unauthorized';

describe('isUnauthorizedError()', () => {
  describe('General cases', () => {
    it('API가 401을 주면 true를 반환해야 한다', () => {
      const error = new ApiResponseError({
        method: 'GET',
        status: UNAUTHORIZED_STATUS,
        url: STUDY_RECORDS_URL,
        errorData: null,
      });

      expect(isUnauthorizedError(error)).toBe(true);
    });
  });

  describe('Boundary cases', () => {
    it.for([HTTP_STATUS.FORBIDDEN, HTTP_STATUS.SERVER_ERROR])(
      'API가 401이 아닌 오류 상태 %d를 주면 false를 반환해야 한다',
      (status) => {
        const error = new ApiResponseError({method: 'GET', status, url: STUDY_RECORDS_URL, errorData: null});

        expect(isUnauthorizedError(error)).toBe(false);
      },
    );
  });

  describe('Edge cases', () => {
    describe('API 응답 오류가 아니면', () => {
      it('status가 401이어도 false를 반환해야 한다', () => {
        const error = Object.assign(new Error('401'), {status: UNAUTHORIZED_STATUS});

        expect(isUnauthorizedError(error)).toBe(false);
      });
    });
  });
});

const UNAUTHORIZED_STATUS = 401;

const STUDY_RECORDS_URL = '/api/study-records';
