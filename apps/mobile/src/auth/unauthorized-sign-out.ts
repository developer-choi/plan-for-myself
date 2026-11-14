interface UnauthorizedSignOutParam {
  /** null: 저장된 토큰이 없다(이미 로그아웃했다) */
  current: string | null;
  /** 401을 받은 요청에 실은 토큰. null: 토큰 없이 보냈다, undefined: 어느 토큰으로 보냈는지 모른다 */
  failed: string | null | undefined;
}

/* 요청을 보낸 사이 Google 연결로 토큰이 바뀌면 옛 토큰의 401이 늦게 와서 새 세션까지 로그아웃시킨다 */
export function shouldSignOutOnUnauthorized({current, failed}: UnauthorizedSignOutParam): boolean {
  if (current === null) {
    return false;
  }
  return failed === undefined || failed === current;
}
