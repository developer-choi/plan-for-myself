import {APP_TOKEN_AUDIENCE} from '@plan-for-myself/shared/auth';
import {jwtVerify, SignJWT} from 'jose';

interface TestTokenOptions {
  algorithm?: string;
  audience?: string;
  issuedAt?: string;
  expirationTime?: string;
  withoutExpiration?: boolean;
  secret?: string;
}

export function signTestToken(
  sub: string | undefined,
  {
    algorithm = 'HS256',
    audience = 'plan-for-myself:app',
    issuedAt,
    expirationTime = '1h',
    withoutExpiration = false,
    secret = process.env.AUTH_SECRET,
  }: TestTokenOptions = {},
): Promise<string> {
  const jwt = new SignJWT({}).setProtectedHeader({alg: algorithm}).setAudience(audience);
  if (sub !== undefined) {
    jwt.setSubject(sub);
  }
  if (issuedAt !== undefined) {
    jwt.setIssuedAt(issuedAt);
  }
  if (!withoutExpiration) {
    jwt.setExpirationTime(expirationTime);
  }
  return jwt.sign(new TextEncoder().encode(secret));
}

export function bearer(token: string) {
  return `Bearer ${token}`;
}

/* 웹(apps/web/src/auth/app-token.ts)이 앱 토큰을 검증하는 방식 그대로 읽어 웹과 서로 통하는 토큰인지 본다 */
export async function readAppTokenClaims(token: string) {
  const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET), {
    audience: APP_TOKEN_AUDIENCE,
    algorithms: ['HS256'],
    requiredClaims: ['exp'],
  });
  return payload;
}
