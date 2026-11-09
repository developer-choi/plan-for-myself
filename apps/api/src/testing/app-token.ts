import {SignJWT} from 'jose';

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
