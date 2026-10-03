import {afterEach, describe, expect, it} from 'vitest';
import {getNextNavigating} from './path';
import {DEFAULT_HOME_URL, getRedirectUrlWhenLoginSuccess} from './redirect';

const PRIVATE_PATH = '/study-records';
const LOGGED_OUT_ONLY_PATH = '/guest';
const PUBLIC_PATH = '/privacy';

describe('getNextNavigating()', () => {
  describe('General cases', () => {
    it('로그인이 필요한 경로에 로그아웃 상태로 오면 원래 주소를 담아 로그인 페이지로 보내야 한다', () => {
      expect(getNextNavigating({pathWithSearch: PRIVATE_PATH, isLoggedIn: false})).toEqual({
        type: 'not-authenticated',
        nextUrl: `/guest/login?redirect=${encodeURIComponent(PRIVATE_PATH)}`,
      });
    });

    it('로그인이 필요한 경로에 로그인 상태로 오면 그대로 통과시켜야 한다', () => {
      expect(getNextNavigating({pathWithSearch: PRIVATE_PATH, isLoggedIn: true})).toEqual({
        type: 'correct',
        nextUrl: PRIVATE_PATH,
      });
    });

    it('로그아웃 상태 전용 경로에 로그인 상태로 오면 홈으로 보내야 한다', () => {
      expect(getNextNavigating({pathWithSearch: `${LOGGED_OUT_ONLY_PATH}?redirect=/foo`, isLoggedIn: true})).toEqual({
        type: 'already-authenticated',
        nextUrl: DEFAULT_HOME_URL,
      });
    });

    it('로그아웃 상태 전용 경로에 로그아웃 상태로 오면 그대로 통과시켜야 한다', () => {
      expect(getNextNavigating({pathWithSearch: LOGGED_OUT_ONLY_PATH, isLoggedIn: false})).toEqual({
        type: 'correct',
        nextUrl: LOGGED_OUT_ONLY_PATH,
      });
    });

    it('누구나 볼 수 있는 경로에 로그인 상태로 오면 그대로 통과시켜야 한다', () => {
      expect(getNextNavigating({pathWithSearch: PUBLIC_PATH, isLoggedIn: true})).toEqual({
        type: 'correct',
        nextUrl: PUBLIC_PATH,
      });
    });

    it('누구나 볼 수 있는 경로에 로그아웃 상태로 오면 그대로 통과시켜야 한다', () => {
      expect(getNextNavigating({pathWithSearch: PUBLIC_PATH, isLoggedIn: false})).toEqual({
        type: 'correct',
        nextUrl: PUBLIC_PATH,
      });
    });
  });

  describe('Boundary cases', () => {
    it('로그인이 필요한 경로의 하위 경로도 로그아웃 상태면 로그인 페이지로 보내야 한다', () => {
      expect(getNextNavigating({pathWithSearch: `${PRIVATE_PATH}/2026/10`, isLoggedIn: false}).type).toBe(
        'not-authenticated',
      );
    });

    it('로그인이 필요한 경로와 이름만 이어지는 다른 경로는 로그아웃 상태여도 통과시켜야 한다', () => {
      expect(getNextNavigating({pathWithSearch: `${PRIVATE_PATH}-other`, isLoggedIn: false}).type).toBe('correct');
    });

    it('로그아웃 상태 전용 경로의 하위 경로도 로그인 상태면 홈으로 보내야 한다', () => {
      expect(getNextNavigating({pathWithSearch: `${LOGGED_OUT_ONLY_PATH}/callback`, isLoggedIn: true}).type).toBe(
        'already-authenticated',
      );
    });

    it('로그아웃 상태 전용 경로와 이름만 이어지는 다른 경로는 로그인 상태여도 통과시켜야 한다', () => {
      expect(getNextNavigating({pathWithSearch: `${LOGGED_OUT_ONLY_PATH}-help`, isLoggedIn: true}).type).toBe(
        'correct',
      );
    });
  });

  describe('Edge cases', () => {
    afterEach(() => {
      history.replaceState(null, '', '/');
    });

    it('쿼리가 여러 개 붙은 주소를 로그인 페이지로 보내도 로그인 뒤 돌아갈 주소에 쿼리가 모두 남아야 한다', () => {
      const pathWithSearch = `${PRIVATE_PATH}?a=1&b=2`;
      const navigating = getNextNavigating({pathWithSearch, isLoggedIn: false});

      history.replaceState(null, '', navigating.nextUrl);

      expect(getRedirectUrlWhenLoginSuccess()).toBe(pathWithSearch);
    });
  });
});
