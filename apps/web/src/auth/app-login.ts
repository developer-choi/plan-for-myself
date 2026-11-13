import type {PostAppTokenApiRequest, PostAppTokenApiResponse} from '@plan-for-myself/shared/auth';
import {issueAppToken, issueGuestAppToken, readAppTokenGuestUserId} from '@/auth/app-token';
import {verifyGoogleIdToken} from '@/auth/google-id-token';
import {
  decideGoogleLogin,
  findGoogleLoginFacts,
  type GoogleLoginParams,
  resolveGoogleLogin,
  type RunInTransaction,
} from '@/auth/google-login';
import {isGuestCreationRateLimited, type RateLimitCheck} from '@/auth/guest-login';
import {createRegisteredRejection, isDiscardIntentValid} from '@/auth/login-cookies';
import {pool, runInPoolTransaction} from '@/server/db/pool';
import {createGuestUserId, type Queryable} from '@/server/user/repository';

interface ExchangeGoogleIdTokenParams extends PostAppTokenApiRequest {
  authorization: string | null;
}

/**
 * null: 구글 ID 토큰 검증에 실패했다
 * @throws AUTH_GOOGLE_ID가 없을 때 (verifyGoogleIdToken)
 * @throws 구글 인증서를 받지 못했을 때 (verifyGoogleIdToken)
 * @throws 판정 뒤 상태가 바뀌어 판정과 어긋났을 때 (issueAppTokenExchange)
 */
export async function exchangeGoogleIdToken({
  idToken,
  discardIntent,
  authorization,
}: ExchangeGoogleIdTokenParams): Promise<PostAppTokenApiResponse | null> {
  const googleSub = await verifyGoogleIdToken(idToken);
  if (googleSub === null) {
    return null;
  }

  const guestUserId = await readAppTokenGuestUserId(authorization);
  const discardIntentValid = guestUserId !== null && isDiscardIntentValid(discardIntent, {guestUserId, googleSub});
  return issueAppTokenExchange({googleSub, guestUserId, discardIntentValid});
}

/**
 * @throws 판정 뒤 다시 판정이 거절로 바뀌었거나 조건부 쿼리가 0행이라 상태가 판정과 어긋났을 때 (resolveGoogleLogin)
 */
export async function issueAppTokenExchange(
  params: GoogleLoginParams,
  runInTransaction: RunInTransaction = runInPoolTransaction,
): Promise<PostAppTokenApiResponse> {
  const facts = await runInTransaction((transaction) => findGoogleLoginFacts(params, transaction));

  const decision = decideGoogleLogin(facts);

  if (decision.type === 'reject') {
    return {type: 'registered-account', rejection: createRegisteredRejection(decision.guestUserId, params.googleSub)};
  }

  const userId = await resolveGoogleLogin(params, runInTransaction);
  return {type: 'session', token: await issueAppToken(userId)};
}

/**
 * null: 게스트 생성 한도에 걸렸다
 * @throws 한도 거절이 아닌 오류일 때 (게스트 행 생성 실패 등)
 */
export async function issueAppTokenForNewGuest(
  request: Request,
  db: Queryable = pool,
  isRateLimited: RateLimitCheck = isGuestCreationRateLimited,
): Promise<string | null> {
  if (await isRateLimited(request)) {
    return null;
  }

  return issueGuestAppToken(await createGuestUserId(db));
}
