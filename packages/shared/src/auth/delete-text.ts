export interface AccountDeleteText {
  trigger: string;
  content: string;
  confirm: string;
  failure: string;
}

export const DELETION_GRACE_DAYS = 7;

export const GOOGLE_DELETE_TEXT = {
  trigger: '회원 탈퇴',
  content: `계정과 기록을 삭제해요. ${DELETION_GRACE_DAYS}일 안에 같은 Google 계정으로 다시 로그인하면 되돌릴 수 있고, 그 뒤에는 완전히 지워져요.`,
  confirm: '탈퇴하기',
  failure: '탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요',
} satisfies AccountDeleteText;

export const GUEST_DELETE_TEXT = {
  trigger: '게스트 계정 삭제',
  content: '게스트 계정과 기록을 모두 삭제해요. 되돌릴 수 없어요.',
  confirm: '삭제',
  failure: '게스트 계정을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요',
} satisfies AccountDeleteText;
