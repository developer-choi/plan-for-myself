export const DEFAULT_HOME_URL = '/study-records';

export const ENTRY_URL = '/';

export const INTRO_URL = '/intro';

export type LoginUrl = `/login?redirect=${string}`;

export function toLoginUrl(pathWithSearch: string): LoginUrl {
  return `/login?redirect=${encodeURIComponent(pathWithSearch)}`;
}

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
