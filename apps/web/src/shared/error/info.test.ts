import {ApiRequestError, ApiResponseError, HTTP_STATUS} from '@developer-choi/utils/api';
import {describe, expect, it} from 'vitest';
import {getErrorInfo} from './info';

function createResponseError(status: number) {
  return new ApiResponseError({method: 'GET', status, url: '/api/example', errorData: null});
}

function createRequestError() {
  return new ApiRequestError({method: 'GET', url: '/api/example'});
}

const FORBIDDEN_INFO = {title: '접근할 수 없어요', content: '권한이 필요해요. 관리자에게 권한을 요청해 주세요.'};
const NOT_FOUND_INFO = {title: '정보를 찾을 수 없어요', content: '삭제되었거나 주소가 변경되었을 수 있어요.'};
const NETWORK_INFO = {title: '연결이 불안정해요', content: '네트워크 상태를 확인한 뒤 다시 시도해 주세요.'};
const TEMPORARY_INFO = {
  title: '일시적인 오류가 발생했어요',
  content: '잠시 후 다시 시도해 주세요. 문제가 계속되면 forworkchoe@gmail.com으로 문의해 주세요.',
};

describe('getErrorInfo()', () => {
  describe('General cases', () => {
    it('403 응답 에러면 권한 요청 안내를 반환해야 한다', () => {
      expect(getErrorInfo(createResponseError(HTTP_STATUS.FORBIDDEN))).toEqual(FORBIDDEN_INFO);
    });

    it('404 응답 에러면 정보를 찾을 수 없다는 안내를 반환해야 한다', () => {
      expect(getErrorInfo(createResponseError(HTTP_STATUS.NOT_FOUND))).toEqual(NOT_FOUND_INFO);
    });

    it('500 응답 에러면 이메일 문의가 담긴 일시적 오류 안내를 반환해야 한다', () => {
      expect(getErrorInfo(createResponseError(HTTP_STATUS.SERVER_ERROR))).toEqual(TEMPORARY_INFO);
    });

    it('요청이 서버에 닿지 못한 에러면 네트워크 확인 안내를 반환해야 한다', () => {
      expect(getErrorInfo(createRequestError())).toEqual(NETWORK_INFO);
    });
  });

  describe('Edge cases', () => {
    it('API 에러가 아닌 일반 에러면 이메일 문의가 담긴 일시적 오류 안내를 반환해야 한다', () => {
      expect(getErrorInfo(new Error('x'))).toEqual(TEMPORARY_INFO);
    });
  });
});
