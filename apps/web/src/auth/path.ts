import {DEFAULT_HOME_URL} from '@/auth/redirect';

interface NextNavigatingParam {
  pathWithSearch: string;
  isLoggedIn: boolean;
}

export type NextNavigatingResult =
  | {
      type: 'not-authenticated';
      nextUrl: `/guest/login?redirect=${string}`;
    }
  | {
      type: 'already-authenticated';
      nextUrl: typeof DEFAULT_HOME_URL;
    }
  | {
      type: 'correct';
      nextUrl: string;
    };

export function getNextNavigating({pathWithSearch, isLoggedIn}: NextNavigatingParam): NextNavigatingResult {
  const nextUrlObject = new URL(`http://some.domain.com${pathWithSearch}`);
  const nextPathname = nextUrlObject.pathname;
  const isPrivate = PRIVATE_PATHNAMES.some((pathname) => isUnderPathname(nextPathname, pathname));
  const isNotPrivate = NOT_PRIVATE_PATHNAME.some((pathname) => isUnderPathname(nextPathname, pathname));

  if (isPrivate && !isLoggedIn) {
    return {
      type: 'not-authenticated',
      nextUrl: `/guest/login?redirect=${encodeURIComponent(pathWithSearch)}`,
    };
  } else if (isNotPrivate && isLoggedIn) {
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

const PRIVATE_PATHNAMES = ['/study-records'];

const NOT_PRIVATE_PATHNAME = ['/guest'];

/* startsWith만 쓰면 '/study-records-old'처럼 이름이 이어지는 다른 경로까지 걸린다 */
function isUnderPathname(target: string, pathname: string) {
  return target === pathname || target.startsWith(`${pathname}/`);
}
