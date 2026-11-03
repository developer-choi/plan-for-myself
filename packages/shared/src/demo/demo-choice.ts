export type DemoChoiceReason = 'tour-end' | 'date-click';

export const DEMO_CONTINUE_LABEL = '계속 둘러보기';

export const LOGGED_OUT_DEMO_CHOICE_MESSAGES: Record<DemoChoiceReason, {title: string; description: string[]}> = {
  'tour-end': {
    title: '이제 내 달력에 적어 볼까요?',
    description: ['지금까지 본 건 예시예요.', '실패를 적으면 내 기록으로 채워져요.'],
  },
  'date-click': {
    title: '예시 화면에서는 기록할 수 없어요',
    description: ['내 달력을 만들면 바로 적을 수 있어요.'],
  },
};

export const LOGGED_IN_DEMO_CHOICE_TITLES: Record<DemoChoiceReason, string> = {
  'tour-end': '이제 내 달력에서 이어서 적어 보세요',
  'date-click': '예시 화면에서는 기록할 수 없어요',
};
