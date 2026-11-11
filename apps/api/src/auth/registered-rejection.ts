import {createHmac, timingSafeEqual} from 'node:crypto';
import type {RegisteredAccountRejection} from '@plan-for-myself/shared/auth';

interface RejectionTarget {
  guestUserId: number;
  googleSub: string;
}

export function createRegisteredRejection(
  guestUserId: number,
  googleSub: string,
  secret: string,
): RegisteredAccountRejection {
  return {guestUserId: String(guestUserId), googleSubHash: hashGoogleSub(googleSub, secret)};
}

/**
 * @param intent null: 게스트 기록을 버리지 않는 일반 교환이다
 */
export function isDiscardIntentValid(
  intent: RegisteredAccountRejection | null,
  current: RejectionTarget,
  secret: string,
): boolean {
  if (!intent || intent.guestUserId !== String(current.guestUserId)) {
    return false;
  }
  const expected = Buffer.from(hashGoogleSub(current.googleSub, secret), 'hex');
  const received = Buffer.from(intent.googleSubHash, 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}

const GOOGLE_SUB_HASH_PREFIX = 'google-sub:';

function hashGoogleSub(googleSub: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(GOOGLE_SUB_HASH_PREFIX + googleSub)
    .digest('hex');
}
