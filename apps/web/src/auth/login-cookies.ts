import {createHmac} from 'node:crypto';
import {type RegisteredAccountRejection, REGISTERED_REJECTION_TTL_SECONDS} from '@plan-for-myself/shared';
import {cookies} from 'next/headers';

export function createRegisteredRejection(guestUserId: string, googleSub: string): RegisteredAccountRejection {
  return {guestUserId, googleSubHash: hashGoogleSub(googleSub)};
}

export async function setRegisteredRejection(guestUserId: string, googleSub: string): Promise<void> {
  (await cookies()).set(REJECTION_COOKIE, serialize(createRegisteredRejection(guestUserId, googleSub)), {
    ...COOKIE_OPTIONS,
    maxAge: REGISTERED_REJECTION_TTL_SECONDS,
  });
}

export async function readRegisteredRejection(): Promise<RegisteredAccountRejection | null> {
  return parse((await cookies()).get(REJECTION_COOKIE)?.value);
}

export async function setDiscardIntent(value: RegisteredAccountRejection): Promise<void> {
  (await cookies()).set(DISCARD_INTENT_COOKIE, serialize(value), {
    ...COOKIE_OPTIONS,
    maxAge: DISCARD_INTENT_MAX_AGE_SECONDS,
  });
}

export async function readDiscardIntent(): Promise<RegisteredAccountRejection | null> {
  return parse((await cookies()).get(DISCARD_INTENT_COOKIE)?.value);
}

export async function clearDiscardIntent(): Promise<void> {
  (await cookies()).delete({name: DISCARD_INTENT_COOKIE, ...COOKIE_OPTIONS});
}

export async function clearLoginCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({name: REJECTION_COOKIE, ...COOKIE_OPTIONS});
  cookieStore.delete({name: DISCARD_INTENT_COOKIE, ...COOKIE_OPTIONS});
}

export function isDiscardIntentValid(
  intent: RegisteredAccountRejection | null,
  current: {guestUserId: string; googleSub: string},
): boolean {
  if (!intent) {
    return false;
  }

  return intent.guestUserId === current.guestUserId && intent.googleSubHash === hashGoogleSub(current.googleSub);
}

const REJECTION_COOKIE = 'registered-account-rejection';
const DISCARD_INTENT_COOKIE = 'discard-guest-intent';
const DISCARD_INTENT_MAX_AGE_SECONDS = 300;
const GOOGLE_SUB_HASH_PREFIX = 'google-sub:';
const COOKIE_VALUE_PATTERN = /^(\d+)\.([0-9a-f]{64})$/;
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
} as const;

function hashGoogleSub(googleSub: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '')
    .update(GOOGLE_SUB_HASH_PREFIX + googleSub)
    .digest('hex');
}

function serialize({guestUserId, googleSubHash}: RegisteredAccountRejection): string {
  return `${guestUserId}.${googleSubHash}`;
}

function parse(raw: string | undefined): RegisteredAccountRejection | null {
  const match = raw?.match(COOKIE_VALUE_PATTERN);

  if (!match) {
    return null;
  }

  return {guestUserId: match[1], googleSubHash: match[2]};
}
