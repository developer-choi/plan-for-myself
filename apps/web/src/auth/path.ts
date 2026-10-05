import type {Session} from 'next-auth';
import {DEFAULT_HOME_URL} from '@/auth/redirect';

export type LoginState = 'logged-out' | 'guest' | 'google';

interface NextNavigatingParam {
  pathWithSearch: string;
  loginState: LoginState;
}

export type NextNavigatingResult =
  | {
      type: 'not-authenticated';
      nextUrl: `/login?redirect=${string}`;
    }
  | {
      type: 'already-authenticated';
      nextUrl: typeof DEFAULT_HOME_URL;
    }
  | {
      type: 'correct';
      nextUrl: string;
    };

export function getLoginState(session: Pick<Session, 'userId' | 'isGuest'> | null): LoginState {
  if (!session?.userId) {
    return 'logged-out';
  }

  return session.isGuest ? 'guest' : 'google';
}

export function getNextNavigating({pathWithSearch, loginState}: NextNavigatingParam): NextNavigatingResult {
  const nextUrlObject = new URL(`http://some.domain.com${pathWithSearch}`);
  const nextPathname = nextUrlObject.pathname;
  const isPrivate = PRIVATE_PATHNAMES.some((pathname) => isUnderPathname(nextPathname, pathname));
  const isNotPrivate = NOT_PRIVATE_PATHNAME.some((pathname) => isUnderPathname(nextPathname, pathname));

  if (isPrivate && loginState === 'logged-out') {
    return {
      type: 'not-authenticated',
      nextUrl: `/login?redirect=${encodeURIComponent(pathWithSearch)}`,
    };
  } else if (isNotPrivate && loginState === 'google') {
    return {
      type: 'already-authenticated',
      nextUrl: DEFAULT_HOME_URL,
    };
  } else {
    return {
      type: 'correct',
      nextUrl: pathWithSearch,
    };
  }
}

const PRIVATE_PATHNAMES = ['/study-records', '/account'];

const NOT_PRIVATE_PATHNAME = ['/login'];

/* startsWith만 쓰면 '/study-records-old'처럼 이름이 이어지는 다른 경로까지 걸린다 */
function isUnderPathname(target: string, pathname: string) {
  return target === pathname || target.startsWith(`${pathname}/`);
}
