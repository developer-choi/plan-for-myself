export const DEFAULT_HOME_URL = '/study-records';

export const INTRO_URL = '/';

/* 일반 로그인·SNS 로그인 등 로그인 수단이 달라도 같은 리다이렉트를 적용하려고 한 함수로 모은다 */
export function toRedirectPath(redirect: string | null): string {
  if (!redirect || !URL.canParse(redirect, PLACEHOLDER_ORIGIN)) {
    return DEFAULT_HOME_URL;
  }

  const {origin, pathname, search} = new URL(redirect, PLACEHOLDER_ORIGIN);
  const isProtocolRelative = pathname.startsWith('//');

  if (origin !== PLACEHOLDER_ORIGIN || isProtocolRelative) {
    return DEFAULT_HOME_URL;
  }

  return pathname + search;
}

const PLACEHOLDER_ORIGIN = 'http://redirect.invalid';
