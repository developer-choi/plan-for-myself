import {afterEach, describe, expect, it} from 'vitest';
import {getLoginState, getNextNavigating, type LoginState, type NextNavigatingResult} from './path';
import {DEFAULT_HOME_URL, getRedirectUrlWhenLoginSuccess, toRedirectPath} from './redirect';

const PRIVATE_PATH = '/study-records';
const LOGIN_PATH = '/login';
const PUBLIC_PATH = '/privacy';

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
            name: '구글로 로그인했으면 홈으로 보내야 한다',
            pathWithSearch: `${LOGIN_PATH}?redirect=/foo`,
            loginState: 'google',
            expected: {type: 'already-authenticated', nextUrl: DEFAULT_HOME_URL},
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
    const boundaryCases: {
      name: string;
      pathWithSearch: string;
      loginState: LoginState;
      expectedType: NextNavigatingResult['type'];
    }[] = [
      {
        name: '로그인이 필요한 경로의 하위 경로도 로그아웃 상태면 로그인 페이지로 보내야 한다',
        pathWithSearch: `${PRIVATE_PATH}/2026/10`,
        loginState: 'logged-out',
        expectedType: 'not-authenticated',
      },
      {
        name: '로그인이 필요한 경로와 이름만 이어지는 다른 경로는 로그아웃 상태여도 열어 줘야 한다',
        pathWithSearch: `${PRIVATE_PATH}-other`,
        loginState: 'logged-out',
        expectedType: 'correct',
      },
      {
        name: '로그인 페이지의 하위 경로도 구글로 로그인했으면 홈으로 보내야 한다',
        pathWithSearch: `${LOGIN_PATH}/callback`,
        loginState: 'google',
        expectedType: 'already-authenticated',
      },
      {
        name: '로그인 페이지의 하위 경로는 로그인 없이 이용 중이어도 열어 줘야 한다',
        pathWithSearch: `${LOGIN_PATH}/callback`,
        loginState: 'guest',
        expectedType: 'correct',
      },
      {
        name: '로그인 페이지와 이름만 이어지는 다른 경로는 구글로 로그인했어도 열어 줘야 한다',
        pathWithSearch: `${LOGIN_PATH}-help`,
        loginState: 'google',
        expectedType: 'correct',
      },
    ];

    boundaryCases.forEach(({name, pathWithSearch, loginState, expectedType}) => {
      it(name, () => {
        expect(getNextNavigating({pathWithSearch, loginState}).type).toBe(expectedType);
      });
    });
  });

  describe('Edge cases', () => {
    afterEach(() => {
      history.replaceState(null, '', '/');
    });

    it('쿼리가 여러 개 붙은 주소를 로그인 페이지로 보내도 로그인 뒤 돌아갈 주소에 쿼리가 모두 남아야 한다', () => {
      const pathWithSearch = `${PRIVATE_PATH}?a=1&b=2`;
      const navigating = getNextNavigating({pathWithSearch, loginState: 'logged-out'});

      history.replaceState(null, '', navigating.nextUrl);

      expect(getRedirectUrlWhenLoginSuccess()).toBe(pathWithSearch);
    });
  });
});

describe('toRedirectPath()', () => {
  [null, ''].forEach((redirect) => {
    it(`돌아갈 주소가 없으면 로그인 뒤 달력으로 간다 (${redirect === null ? '주소 없음' : '빈 문자열'})`, () => {
      expect(toRedirectPath(redirect)).toBe(DEFAULT_HOME_URL);
    });
  });

  it('돌아갈 주소의 경로와 쿼리를 그대로 남긴다', () => {
    const pathWithSearch = `${PRIVATE_PATH}/2026/10?a=1&b=2`;

    expect(toRedirectPath(pathWithSearch)).toBe(pathWithSearch);
  });

  it('돌아갈 주소가 주소 모양이 아니면 로그인 뒤 달력으로 간다', () => {
    expect(toRedirectPath('http://[')).toBe(DEFAULT_HOME_URL);
  });

  [
    'https://evil.example/study-records',
    '//evil.example/study-records',
    '/\\evil.example/study-records',
    '/.//evil.example/study-records',
  ].forEach((redirect) => {
    it(`다른 사이트 주소가 들어와도 이 사이트 밖으로 보내지 않는다 (${redirect})`, () => {
      expect(toRedirectPath(redirect)).toBe(DEFAULT_HOME_URL);
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
