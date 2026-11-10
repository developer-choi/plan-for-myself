import type {StudyRecordMonthly} from '../study-record/type';

export type DemoTourPart = 'calendar' | 'stats';

export type DemoCalendarTourTarget = 'firstRecordDate' | 'statsLink';

export type DemoStatsTourTarget = 'failGroups' | 'firstTagRow' | 'tagDetailCard';

interface DemoTourStepDefinition<Target extends string> {
  target: Target;
  content: string;
}

export const DEMO_CALENDAR_TOUR_STEPS: DemoTourStepDefinition<DemoCalendarTourTarget>[] = [
  {target: 'firstRecordDate', content: '실패와 공부시간이 여기 보여요'},
  {target: 'statsLink', content: '여기서 통계를 볼 수 있어요. 「다음」을 누르면 통계 화면으로 넘어가요'},
];

export const DEMO_STATS_TOUR_STEPS: DemoTourStepDefinition<DemoStatsTourTarget>[] = [
  {
    target: 'failGroups',
    content: '통계 화면이에요. 지난달과 비교해 어떤 실패가 반복되고, 새로 생기고, 줄고 있는지 보여요',
  },
  {target: 'firstTagRow', content: '태그를 누르면 그 실패만 모아 볼 수 있어요'},
  {target: 'tagDetailCard', content: '이 실패를 한 날이 달력에 보여요. 아래에서 달마다 추이도 볼 수 있어요'},
];

export const DEMO_TOUR_STEP_COUNT = DEMO_CALENDAR_TOUR_STEPS.length + DEMO_STATS_TOUR_STEPS.length;

export const DEMO_STATS_TOUR_FIRST_NUMBER = DEMO_CALENDAR_TOUR_STEPS.length + 1;

export const DEMO_TOUR_BUTTON_LABELS = {next: '다음', last: '마치기', close: '닫기'};

/* 투어가 짚는 실패 카드 묶음이 없는 달에서는 띄우지 않는다 — 말풍선 없이 끝나도 「봤음」으로 찍혀 다시 안 뜬다 */
export function shouldShowDemoStatsTour(monthly: Pick<StudyRecordMonthly, 'failureTags'>): boolean {
  return monthly.failureTags.length > 0;
}
