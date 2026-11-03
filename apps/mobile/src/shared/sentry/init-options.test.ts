import type {ErrorEvent} from '@sentry/core';
import {breadcrumbsIntegration, dedupeIntegration, httpContextIntegration} from '@sentry/react-native';
import {ApiRequestError, ApiResponseError} from '@developer-choi/utils/api';
import {describe, expect, it} from '@jest/globals';
import {beforeSendFromApp, excludeHeaderIntegration, excludeRequestBreadcrumb} from './init-options';

describe('excludeHeaderIntegration()', () => {
  describe('General cases', () => {
    it('요청 헤더를 보내는 HttpContext만 뺀 integration 목록을 원래 순서대로 반환해야 한다', () => {
      const breadcrumbs = breadcrumbsIntegration();
      const dedupe = dedupeIntegration();

      expect(excludeHeaderIntegration([breadcrumbs, httpContextIntegration(), dedupe])).toEqual([breadcrumbs, dedupe]);
    });
  });
});

describe('excludeRequestBreadcrumb()', () => {
  describe('General cases', () => {
    it.each(['fetch', 'xhr'])('%s 기록은 버려야 한다', (category) => {
      expect(excludeRequestBreadcrumb({category})).toBeNull();
    });

    it('요청 기록이 아니면 그대로 남겨야 한다', () => {
      const navigation = {category: 'navigation'};

      expect(excludeRequestBreadcrumb(navigation)).toBe(navigation);
    });
  });
});

describe('beforeSendFromApp()', () => {
  describe('General cases', () => {
    it('앱 권한을 뺀 나머지 앱 정보를 남겨야 한다', () => {
      const event = createEvent({contexts: {app: {name: '앱', permissions: {INTERNET: 'granted'}}}});

      expect(beforeSendFromApp(event, {})?.contexts?.app).toEqual({name: '앱'});
    });
  });

  describe('Boundary cases', () => {
    it('앱 정보가 없는 이벤트도 그대로 보내야 한다', () => {
      expect(beforeSendFromApp(createEvent({}), {})).toMatchObject({message: '오류'});
    });
  });

  describe('Edge cases', () => {
    it('로그인 응답이 실패하면 요청 본문의 토큰을 보내지 않아야 한다', () => {
      const error = new ApiResponseError({...LOGIN_REQUEST, status: 500, errorData: {}});

      expect(JSON.stringify(beforeSendFromApp(createEvent({}), {originalException: error}))).not.toContain(ID_TOKEN);
    });

    it('로그인 요청이 네트워크에서 실패하면 요청 본문의 토큰을 보내지 않아야 한다', () => {
      const error = new ApiRequestError(LOGIN_REQUEST);

      expect(JSON.stringify(beforeSendFromApp(createEvent({}), {originalException: error}))).not.toContain(ID_TOKEN);
    });

    it('로그인이 아닌 요청의 실패는 오류 객체를 그대로 남겨야 한다', () => {
      const error = new ApiRequestError({...LOGIN_REQUEST, url: 'http://localhost/api/study-records'});

      expect(beforeSendFromApp(createEvent({}), {originalException: error})?.extra?.original).toBe(error);
    });
  });
});

const ID_TOKEN = 'aaa.bbb.ccc';
const LOGIN_REQUEST = {
  method: 'POST',
  url: 'http://localhost/api/app-token',
  body: {idToken: ID_TOKEN},
  headers: {},
} as const;

function createEvent(event: Partial<ErrorEvent>): ErrorEvent {
  return {type: undefined, message: '오류', ...event};
}
