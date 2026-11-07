import {issueAppToken} from '@/auth/app-token';
import {verifyGoogleIdToken} from '@/auth/google-id-token';
import {resolveGoogleLogin, type RunInTransaction} from '@/auth/google-login';
import {runInPoolTransaction} from '@/server/db/pool';

/**
 * null: 구글 ID 토큰 검증에 실패했다
 * @throws AUTH_GOOGLE_ID가 없을 때 (verifyGoogleIdToken)
 * @throws 구글 인증서를 받지 못했을 때 (verifyGoogleIdToken)
 */
export async function exchangeGoogleIdToken(idToken: string): Promise<string | null> {
  const googleSub = await verifyGoogleIdToken(idToken);
  return googleSub === null ? null : issueAppTokenForGoogleSub(googleSub);
}

export async function issueAppTokenForGoogleSub(
  googleSub: string,
  runInTransaction: RunInTransaction = runInPoolTransaction,
): Promise<string> {
  const userId = await resolveGoogleLogin({googleSub, guestUserId: null, discardIntentValid: false}, runInTransaction);
  return issueAppToken(userId);
}
