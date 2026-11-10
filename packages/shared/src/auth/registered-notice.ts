import type {RegisteredAccountRejection} from './registered-rejection';

interface RegisteredNoticeSession {
  /** null: 토큰에서 사용자 ID를 읽지 못했다 */
  userId: string | null;
  isGuest: boolean;
}

export function shouldShowRegisteredNotice(
  rejection: RegisteredAccountRejection | null,
  session: RegisteredNoticeSession | null,
): boolean {
  if (!rejection || !session?.isGuest) {
    return false;
  }

  return rejection.guestUserId === session.userId;
}
