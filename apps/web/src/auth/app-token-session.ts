import type {AppTokenClaims} from '@plan-for-myself/shared/auth';
import {ImpossibleStateError} from '@plan-for-myself/shared/error';
import {decodeJwt} from 'jose';

interface ReadAppTokenResult {
  userId: string;
  isGuest: boolean;
  /** 초 단위 UNIX 시각. 토큰에 exp가 없으면 null */
  expiresAt: number | null;
}

export function readAppTokenClaims(token: string): ReadAppTokenResult {
  const payload = decodeJwt<AppTokenClaims>(token);
  if (typeof payload.sub !== 'string') {
    throw new ImpossibleStateError('앱 토큰에 sub가 없다');
  }
  return {userId: payload.sub, isGuest: payload.isGuest === true, expiresAt: payload.exp ?? null};
}

export function shouldRefreshAppToken(token: string, now = Date.now()): boolean {
  const {expiresAt} = readAppTokenClaims(token);
  if (expiresAt === null) {
    return true;
  }
  return expiresAt * MILLISECONDS_PER_SECOND - now < REFRESH_BEFORE_EXPIRY_MS;
}

/**
 * @param retryAt 밀리초 UNIX 시각. 갱신이 실패한 적 없으면 undefined
 */
export function isRefreshRetryWaiting(retryAt: number | undefined, now = Date.now()): boolean {
  return retryAt !== undefined && now < retryAt;
}

export function getRefreshRetryAt(now = Date.now()): number {
  return now + REFRESH_RETRY_DELAY_MS;
}

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86_400;
const MILLISECONDS_PER_MINUTE = 60_000;
const REFRESH_BEFORE_EXPIRY_DAYS = 7;
const REFRESH_BEFORE_EXPIRY_MS = REFRESH_BEFORE_EXPIRY_DAYS * SECONDS_PER_DAY * MILLISECONDS_PER_SECOND;
const REFRESH_RETRY_DELAY_MINUTES = 5;
const REFRESH_RETRY_DELAY_MS = REFRESH_RETRY_DELAY_MINUTES * MILLISECONDS_PER_MINUTE;
