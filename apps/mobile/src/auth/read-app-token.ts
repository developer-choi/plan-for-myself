import {jwtDecode} from 'jwt-decode';
import type {AppTokenClaims} from '@plan-for-myself/shared';

export function readIsGuest(token: string | null): boolean {
  return decodeToken(token)?.isGuest === true;
}

/**
 * null: 토큰이 없거나 풀리지 않거나 sub가 없다
 */
export function readTokenUserId(token: string | null): string | null {
  return decodeToken(token)?.sub ?? null;
}

function decodeToken(token: string | null): AppTokenClaims | null {
  if (token === null) {
    return null;
  }

  try {
    return jwtDecode<AppTokenClaims>(token);
  } catch {
    return null;
  }
}
