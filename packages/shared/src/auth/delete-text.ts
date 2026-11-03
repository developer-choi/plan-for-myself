export interface AccountDeleteText {
  trigger: string;
  content: string;
  confirm: string;
  failure: string;
}

const DELETE_CONTENT = '계정과 기록을 모두 삭제해요. 되돌릴 수 없어요.';

export const GOOGLE_DELETE_TEXT = {
  trigger: '회원 탈퇴',
  content: DELETE_CONTENT,
  confirm: '탈퇴하기',
  failure: '탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요',
} satisfies AccountDeleteText;

export const GUEST_DELETE_TEXT = {
  trigger: '게스트 계정 삭제',
  content: DELETE_CONTENT,
  confirm: '삭제',
  failure: '게스트 계정을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요',
} satisfies AccountDeleteText;
