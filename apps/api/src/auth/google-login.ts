export interface GoogleLoginFacts {
  /** null: 게스트 토큰이 없거나 그 사용자가 더는 게스트가 아니다 */
  guestUserId: number | null;
  guestHasRecords: boolean;
  /** null: 이 Google 계정으로 가입된 사용자가 없다 */
  registeredUserId: number | null;
  discardIntentValid: boolean;
}

type GoogleLoginDecision =
  | {type: 'link'; guestUserId: number}
  | {type: 'switch-delete-empty-guest'; guestUserId: number; registeredUserId: number}
  | {type: 'reject'; guestUserId: number}
  | {type: 'switch-discard-guest'; guestUserId: number; registeredUserId: number}
  | {type: 'find-or-create'};

export function decideGoogleLogin({
  guestUserId,
  guestHasRecords,
  registeredUserId,
  discardIntentValid,
}: GoogleLoginFacts): GoogleLoginDecision {
  if (guestUserId === null) {
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

  return {type: 'reject', guestUserId};
}
