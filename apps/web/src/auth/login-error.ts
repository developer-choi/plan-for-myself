export type LoginErrorKind = 'guest-limit' | 'failed';

interface LoginErrorQuery {
  /* 없음: 로그인 오류로 돌아온 게 아닌 경우 */
  error?: string | string[];
  /* 없음: 게스트 로그인 거절(CredentialsSignin)이 아닌 오류인 경우 (구글 로그인 실패 등) */
  code?: string | string[];
}

export function getLoginErrorKind(query: LoginErrorQuery): LoginErrorKind | null {
  const error = Array.isArray(query.error) ? query.error[0] : query.error;
  const code = Array.isArray(query.code) ? query.code[0] : query.code;

  if (error === undefined) {
    return null;
  }

  return code === GUEST_LIMIT_CODE ? 'guest-limit' : 'failed';
}

export const GUEST_LIMIT_CODE = 'guest_limit';
