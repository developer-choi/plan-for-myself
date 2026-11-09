interface MutationState {
  isPending: boolean;
  isSuccess: boolean;
}

/**
 * 성공 후 화면을 떠나기(페이지 이동·모달 닫힘) 전까지 로딩 상태를 유지합니다.
 * isSuccess 시점에 로딩을 풀면 사용자가 재클릭할 수 있습니다.
 */
export function isMutationSettling(...mutations: MutationState[]) {
  return mutations.some((mutation) => mutation.isPending || mutation.isSuccess);
}
