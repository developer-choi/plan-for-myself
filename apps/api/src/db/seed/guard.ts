/* 운영 branch를 막는 대신 개발 branch만 연다. 주소가 비어 localhost로 붙으면 branch ID가 비어 「운영이 아니다」로 지나가기 때문이다 */
export function assertDevBranch(branchId: string | null) {
  if (branchId !== DEV_BRANCH_ID) {
    throw new Error(
      `개발 DB(Neon branch ${DEV_BRANCH_ID})가 아니라 시드를 넣지 않는다. 접속한 branch: ${branchId ?? '알 수 없음'}`,
    );
  }
}

const DEV_BRANCH_ID = 'br-shy-smoke-a1g8pig9';
