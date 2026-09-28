import {DEFAULT_HOME_URL} from '@/utils/service/auth/redirect';

interface NextNavigatingParam {
  nextUrl: string; // pathname + querystring
  isLoggedIn: boolean;
}

export type NextNavigatingResult = {
  type: "not-authenticated";
  nextUrl: `/guest/login?redirect=${string}`
} | {
  type: "already-authenticated";
  nextUrl: typeof DEFAULT_HOME_URL
} | {
  type: "correct",
  nextUrl: string; // parameter로 전달했던 nextUrl과 같은 값
};

export function getNextNavigating({nextUrl, isLoggedIn}: NextNavigatingParam): NextNavigatingResult {
  const nextUrlObject = new URL(`http://some.domain.com${nextUrl}`);
  const nextPathname = nextUrlObject.pathname;
  const isPrivate = PRIVATE_PATHNAMES.some(pathname => nextPathname.startsWith(pathname));
  const isNotPrivate = NOT_PRIVATE_PATHNAME.some(pathname => nextPathname.startsWith(pathname));

  if (isPrivate && !isLoggedIn) {
    return {
      type: "not-authenticated",
      nextUrl: `/guest/login?redirect=${nextUrl}`
    };
  } else if (isNotPrivate && isLoggedIn) {
    return {
      type: 'already-authenticated',
      nextUrl: DEFAULT_HOME_URL
    }

  } else {
    return {
      type: "correct",
      nextUrl
    };
  }
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
const PRIVATE_PATHNAMES = [
  '/studied-time',
];

const NOT_PRIVATE_PATHNAME = [
  '/guest',
];
