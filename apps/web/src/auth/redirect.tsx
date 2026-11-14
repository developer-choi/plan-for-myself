export const DEFAULT_HOME_URL = '/study-records';

export const ENTRY_URL = '/';

export type LoginUrl = `/login?redirect=${string}`;

export type LoginReason = 'signed-out';

export const LOGIN_REASON_PARAM = 'reason';

export function toLoginUrl(pathWithSearch: string, reason?: LoginReason): LoginUrl {
  const base: LoginUrl = `/login?redirect=${encodeURIComponent(pathWithSearch)}`;
  return reason ? `${base}&${LOGIN_REASON_PARAM}=${reason}` : base;
}

/**
 * null: 알 수 없는 이유이거나 이유가 없다
 */
export function readLoginReason(value: string | string[] | undefined): LoginReason | null {
  const reason = Array.isArray(value) ? value[0] : value;
  return reason === 'signed-out' ? reason : null;
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
