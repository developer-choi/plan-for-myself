import {runInPoolTransaction} from '@/server/db/pool';
import {
  deleteGuestUser,
  findGoogleLoginRows,
  findOrCreateUserId,
  linkGuestToGoogle,
  type Queryable,
} from '@/server/user/repository';

export interface GoogleLoginFacts {
  guestUserId: string | null;
  guestHasRecords: boolean;
  /** 이 OAuth 계정으로 가입된 사용자가 없으면 null */
  registeredUserId: string | null;
  discardIntentValid: boolean;
}

export type GoogleLoginDecision =
  | {type: 'link'; guestUserId: string}
  | {type: 'switch-delete-empty-guest'; guestUserId: string; registeredUserId: string}
  | {type: 'reject'}
  | {type: 'switch-discard-guest'; guestUserId: string; registeredUserId: string}
  | {type: 'find-or-create'};

export interface GoogleLoginParams {
  googleSub: string;
  guestUserId: string | null;
  discardIntentValid: boolean;
}

export type RunInTransaction = <T>(work: (transaction: Queryable) => Promise<T>) => Promise<T>;

export function decideGoogleLogin({
  guestUserId,
  guestHasRecords,
  registeredUserId,
  discardIntentValid,
}: GoogleLoginFacts): GoogleLoginDecision {
  const alreadyLinked = guestUserId !== null && guestUserId === registeredUserId;

  if (guestUserId === null || alreadyLinked) {
    return {type: 'find-or-create'};
  }

  if (registeredUserId === null) {
    return {type: 'link', guestUserId};
  }

  if (!guestHasRecords) {
    return {type: 'switch-delete-empty-guest', guestUserId, registeredUserId};
  }

  if (discardIntentValid) {
    return {type: 'switch-discard-guest', guestUserId, registeredUserId};
  }

  return {type: 'reject'};
}

export async function findGoogleLoginFacts(
  {googleSub, guestUserId, discardIntentValid}: GoogleLoginParams,
  db: Queryable,
): Promise<GoogleLoginFacts> {
  if (guestUserId === null) {
    return {guestUserId: null, guestHasRecords: false, registeredUserId: null, discardIntentValid: false};
  }

  const rows = await findGoogleLoginRows(guestUserId, googleSub, db);

  return {guestUserId, ...rows, discardIntentValid};
}

/**
 * @throws {Error} 거절 판정이 나왔을 때(signIn이 먼저 거절했어야 한다), 또는 판정 뒤 조건부 쿼리가 0행이라 상태가 판정과 어긋났을 때
 */
export async function resolveGoogleLogin(
  params: GoogleLoginParams,
  runInTransaction: RunInTransaction = runInPoolTransaction,
): Promise<string> {
  return runInTransaction(async (transaction) => {
    const decision = decideGoogleLogin(await findGoogleLoginFacts(params, transaction));

    switch (decision.type) {
      case 'find-or-create':
        return findOrCreateUserId(params.googleSub, transaction);
      case 'link':
        await linkGuestToGoogle(decision.guestUserId, params.googleSub, transaction);
        return decision.guestUserId;
      case 'switch-delete-empty-guest':
        await deleteGuestUser(decision.guestUserId, {withRecords: false}, transaction);
        return decision.registeredUserId;
      case 'switch-discard-guest':
        await deleteGuestUser(decision.guestUserId, {withRecords: true}, transaction);
        return decision.registeredUserId;
      case 'reject':
        throw new Error('기록 있는 게스트가 기록 삭제 없이 가입된 구글 계정으로 로그인하려 했다');
    }
  });
}
