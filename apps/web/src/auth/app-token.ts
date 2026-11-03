import {errors, type JWTPayload, jwtVerify, SignJWT} from 'jose';
import type {AppTokenClaims} from '@plan-for-myself/shared';
import {SESSION_MAX_AGE_SECONDS} from '@/auth/session-max-age';

export const APP_TOKEN_AUDIENCE = 'plan-for-myself:app';

export async function issueAppToken(userId: string): Promise<string> {
  return signAppToken({sub: userId});
}

export async function issueGuestAppToken(userId: string): Promise<string> {
  return signAppToken({sub: userId, isGuest: true} satisfies AppTokenClaims);
}

/**
 * null: 유효한 앱용 토큰이 없다
 */
export async function refreshAppToken(authorization: string | null): Promise<string | null> {
  const payload = await readBearerPayload(authorization);
  if (payload?.sub === undefined) {
    return null;
  }

  return signAppToken(payload);
}

/**
 * null: 유효한 앱용 토큰이 없다
 */
export async function readAuthorizationUserId(authorization: string | null): Promise<string | null> {
  const payload = await readBearerPayload(authorization);
  return payload?.sub ?? null;
}

/**
 * null: 유효한 게스트 앱용 토큰이 없다
 */
export async function readAppTokenGuestUserId(authorization: string | null): Promise<string | null> {
  const payload = await readBearerPayload(authorization);
  if (payload?.isGuest !== true) {
    return null;
  }

  return payload.sub ?? null;
}

/**
 * null: 쿠키 세션도 유효한 앱용 토큰도 없다
 */
export async function pickRequestUserId(
  sessionUserId: string | null,
  authorization: string | null,
): Promise<string | null> {
  return sessionUserId ?? readAuthorizationUserId(authorization);
}

/**
 * @throws secret이 없거나 32바이트보다 짧을 때
 */
export function readAppTokenKey(secret: string | undefined): Uint8Array {
  const key = new TextEncoder().encode(secret);

  if (key.byteLength < HS256_MIN_KEY_BYTES) {
    throw new Error('AUTH_SECRET이 32바이트보다 짧아 앱용 토큰을 서명할 수 없다');
  }
  return key;
}

const BEARER_PREFIX = 'Bearer ';
const HS256_MIN_KEY_BYTES = 32;
const MILLISECONDS_PER_SECOND = 1000;

async function signAppToken(claims: JWTPayload): Promise<string> {
  const issuedAt = Math.floor(Date.now() / MILLISECONDS_PER_SECOND);

  return new SignJWT(claims)
    .setProtectedHeader({alg: 'HS256'})
    .setAudience(APP_TOKEN_AUDIENCE)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + SESSION_MAX_AGE_SECONDS)
    .sign(readAppTokenKey(process.env.AUTH_SECRET));
}

/**
 * null: 토큰이 만료됐거나 exp가 없거나 alg가 HS256이 아니거나 서명·aud가 틀렸거나 형식이 깨졌다
 */
async function verifyAppToken(token: string): Promise<(JWTPayload & AppTokenClaims) | null> {
  try {
    const {payload} = await jwtVerify<AppTokenClaims>(token, readAppTokenKey(process.env.AUTH_SECRET), {
      audience: APP_TOKEN_AUDIENCE,
      algorithms: ['HS256'],
      requiredClaims: ['exp'],
    });
    return payload;
  } catch (error) {
    if (error instanceof errors.JOSEError) {
      return null;
    }
    throw error;
  }
}

async function readBearerPayload(authorization: string | null): Promise<(JWTPayload & AppTokenClaims) | null> {
  const token = readBearerToken(authorization);
  return token === null ? null : verifyAppToken(token);
}

/**
 * null: authorization 헤더가 없거나 'Bearer '로 시작하지 않는다(대소문자 구분)
 */
function readBearerToken(authorization: string | null): string | null {
  if (!authorization?.startsWith(BEARER_PREFIX)) {
    return null;
  }
  return authorization.slice(BEARER_PREFIX.length);
}
