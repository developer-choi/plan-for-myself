import {describe, expect, it} from 'vitest';
import {getLoginState, getNextNavigating, type LoginState, type NextNavigatingResult} from './path';

const PRIVATE_PATH = '/study-records';
const PRIVATE_PATH_WITH_SEARCH = `${PRIVATE_PATH}/2026/10?a=1&b=2`;
const LOGIN_PATH = '/login';
const PUBLIC_PATH = '/privacy';
const INTRO_PATH = '/';
const DEMO_PATHNAME = '/demo';
const DEMO_PATH = `${DEMO_PATHNAME}/study-records/2026/9`;

describe('getNextNavigating()', () => {
  describe('General cases', () => {
    const pageGroups: {
      page: string;
      cases: {name: string; pathWithSearch: string; loginState: LoginState; expected: NextNavigatingResult}[];
    }[] = [
      {
        page: '로그인이 필요한 페이지를 열 때',
        cases: [
          {
            name: '로그아웃 상태면 로그인 뒤 돌아올 주소를 담아 로그인 페이지로 보내야 한다',
            pathWithSearch: PRIVATE_PATH,
            loginState: 'logged-out',
            expected: {type: 'not-authenticated', nextUrl: `/login?redirect=${encodeURIComponent(PRIVATE_PATH)}`},
          },
          {
            name: '로그아웃 상태면 돌아올 주소에 쿼리까지 담아야 한다',
            pathWithSearch: PRIVATE_PATH_WITH_SEARCH,
            loginState: 'logged-out',
            expected: {
              type: 'not-authenticated',
              nextUrl: `/login?redirect=${encodeURIComponent(PRIVATE_PATH_WITH_SEARCH)}`,
            },
          },
          {
            name: '로그인 없이 이용 중이면 열어 줘야 한다',
            pathWithSearch: PRIVATE_PATH,
            loginState: 'guest',
            expected: {type: 'correct', nextUrl: PRIVATE_PATH},
          },
          {
            name: '구글로 로그인했으면 열어 줘야 한다',
            pathWithSearch: PRIVATE_PATH,
            loginState: 'google',
            expected: {type: 'correct', nextUrl: PRIVATE_PATH},
          },
        ],
      },
      {
        page: '로그인 페이지를 열 때',
        cases: [
          {
            name: '로그아웃 상태면 열어 줘야 한다',
            pathWithSearch: LOGIN_PATH,
            loginState: 'logged-out',
            expected: {type: 'correct', nextUrl: LOGIN_PATH},
          },
          {
            name: '로그인 없이 이용 중이어도 구글 계정을 연결할 수 있게 열어 줘야 한다',
            pathWithSearch: LOGIN_PATH,
            loginState: 'guest',
            expected: {type: 'correct', nextUrl: LOGIN_PATH},
          },
          {
            name: '구글로 로그인했으면 소개 페이지로 보내야 한다',
            pathWithSearch: LOGIN_PATH,
            loginState: 'google',
            expected: {type: 'already-authenticated', nextUrl: '/'},
          },
        ],
      },
      {
        page: '소개 페이지를 열 때',
        cases: [
          {
            name: '로그아웃 상태여도 열어 줘야 한다',
            pathWithSearch: INTRO_PATH,
            loginState: 'logged-out',
            expected: {type: 'correct', nextUrl: '/'},
          },
          {
            name: '로그인 없이 이용 중이어도 열어 줘야 한다',
            pathWithSearch: INTRO_PATH,
            loginState: 'guest',
            expected: {type: 'correct', nextUrl: '/'},
          },
          {
            name: '구글로 로그인했어도 열어 줘야 한다',
            pathWithSearch: INTRO_PATH,
            loginState: 'google',
            expected: {type: 'correct', nextUrl: '/'},
          },
        ],
      },
      {
        page: '개인정보 처리방침을 열 때',
        cases: [
          {
            name: '로그아웃 상태여도 열어 줘야 한다',
            pathWithSearch: PUBLIC_PATH,
            loginState: 'logged-out',
            expected: {type: 'correct', nextUrl: PUBLIC_PATH},
          },
          {
            name: '로그인 없이 이용 중이어도 열어 줘야 한다',
            pathWithSearch: PUBLIC_PATH,
            loginState: 'guest',
            expected: {type: 'correct', nextUrl: PUBLIC_PATH},
          },
          {
            name: '구글로 로그인했어도 열어 줘야 한다',
            pathWithSearch: PUBLIC_PATH,
            loginState: 'google',
            expected: {type: 'correct', nextUrl: PUBLIC_PATH},
          },
        ],
      },
      {
        page: '예시 페이지를 열 때',
        cases: [
          {
            name: '로그아웃 상태면 열어 줘야 한다',
            pathWithSearch: DEMO_PATH,
            loginState: 'logged-out',
            expected: {type: 'correct', nextUrl: DEMO_PATH},
          },
          {
            name: '로그인 없이 이용 중이면 소개 페이지로 보내야 한다',
            pathWithSearch: DEMO_PATH,
            loginState: 'guest',
            expected: {type: 'already-authenticated', nextUrl: '/'},
          },
          {
            name: '구글로 로그인했으면 소개 페이지로 보내야 한다',
            pathWithSearch: DEMO_PATH,
            loginState: 'google',
            expected: {type: 'already-authenticated', nextUrl: '/'},
          },
        ],
      },
    ];

    pageGroups.forEach(({page, cases}) => {
      describe(page, () => {
        cases.forEach(({name, pathWithSearch, loginState, expected}) => {
          it(name, () => {
            expect(getNextNavigating({pathWithSearch, loginState})).toEqual(expected);
          });
        });
      });
    });
  });

  describe('Boundary cases', () => {
    const pathGroups: {
      path: string;
      cases: {
        name: string;
        pathWithSearch: string;
        loginState: LoginState;
        expectedType: NextNavigatingResult['type'];
      }[];
    }[] = [
      {
        path: '로그인이 필요한 경로의 하위 경로',
        cases: [
          {
            name: '로그아웃 상태면 로그인 페이지로 보내야 한다',
            pathWithSearch: `${PRIVATE_PATH}/2026/10`,
            loginState: 'logged-out',
            expectedType: 'not-authenticated',
          },
        ],
      },
      {
        path: '로그인이 필요한 경로와 이름만 이어지는 다른 경로',
        cases: [
          {
            name: '로그아웃 상태여도 열어 줘야 한다',
            pathWithSearch: `${PRIVATE_PATH}-other`,
            loginState: 'logged-out',
            expectedType: 'correct',
          },
        ],
      },
      {
        path: '로그인 페이지의 하위 경로',
        cases: [
          {
            name: '구글로 로그인했으면 소개 페이지로 보내야 한다',
            pathWithSearch: `${LOGIN_PATH}/callback`,
            loginState: 'google',
            expectedType: 'already-authenticated',
          },
          {
            name: '로그인 없이 이용 중이어도 열어 줘야 한다',
            pathWithSearch: `${LOGIN_PATH}/callback`,
            loginState: 'guest',
            expectedType: 'correct',
          },
        ],
      },
      {
        path: '로그인 페이지와 이름만 이어지는 다른 경로',
        cases: [
          {
            name: '구글로 로그인했어도 열어 줘야 한다',
            pathWithSearch: `${LOGIN_PATH}-help`,
            loginState: 'google',
            expectedType: 'correct',
          },
        ],
      },
      {
        path: '예시 경로와 이름만 이어지는 다른 경로',
        cases: [
          {
            name: '로그인 없이 이용 중이어도 열어 줘야 한다',
            pathWithSearch: `${DEMO_PATHNAME}-old`,
            loginState: 'guest',
            expectedType: 'correct',
          },
        ],
      },
    ];

    pathGroups.forEach(({path, cases}) => {
      describe(path, () => {
        cases.forEach(({name, pathWithSearch, loginState, expectedType}) => {
          it(name, () => {
            expect(getNextNavigating({pathWithSearch, loginState}).type).toBe(expectedType);
          });
        });
      });
    });
  });
});

describe('getLoginState()', () => {
  describe('General cases', () => {
    it('로그인하지 않았으면 로그아웃 상태로 봐야 한다', () => {
      expect(getLoginState(null)).toBe('logged-out');
    });

    it('로그인 없이 시작한 사용자는 로그인 없이 이용 중인 상태로 봐야 한다', () => {
      expect(getLoginState({userId: '1', isGuest: true})).toBe('guest');
    });

    it('구글로 로그인한 사용자는 구글 로그인 상태로 봐야 한다', () => {
      expect(getLoginState({userId: '1', isGuest: false})).toBe('google');
    });
  });

  describe('Edge cases', () => {
    it('로그인 정보에 사용자 식별 값이 없으면 로그아웃 상태로 봐야 한다', () => {
      expect(getLoginState({userId: '', isGuest: false})).toBe('logged-out');
    });
  });
});
