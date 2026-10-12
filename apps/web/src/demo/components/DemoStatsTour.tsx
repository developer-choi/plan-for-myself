'use client';

import {ACTIONS, type EventData, EVENTS, Joyride, type Step, type TooltipRenderProps} from 'react-joyride';
import TourBubble from '@/demo/components/TourBubble';
import {DEMO_TOUR_FLOATING_OPTIONS, DEMO_TOUR_LOCALE, DEMO_TOUR_OPTIONS, DEMO_TOUR_STYLES} from '@/demo/demo-tour';
import {useOpenDemoChoiceDialog} from '@/demo/useOpenDemoChoiceDialog';
import {FAIL_GROUPS_ID, FIRST_TAG_ROW_ID} from '@/study-record-stats/components/FailCard';
import {TAG_CALENDAR_SECTION_ID} from '@/study-record-stats/components/TagDetailCard';

export default function DemoStatsTour() {
  const openChoiceDialog = useOpenDemoChoiceDialog();

  const handleEvent = (data: EventData) => {
    const isNextOnLastStep =
      data.type === EVENTS.STEP_AFTER && data.action === ACTIONS.NEXT && data.index === STATS_TOUR_STEPS.length - 1;

    if (isNextOnLastStep) {
      openChoiceDialog();
    }
  };

  return (
    <Joyride
      continuous
      run
      floatingOptions={DEMO_TOUR_FLOATING_OPTIONS}
      locale={DEMO_TOUR_LOCALE}
      options={DEMO_TOUR_OPTIONS}
      steps={STATS_TOUR_STEPS}
      styles={DEMO_TOUR_STYLES}
      tooltipComponent={StatsTourBubble}
      onEvent={handleEvent}
    />
  );
}

const STATS_TOUR_STEPS: Step[] = [
  {
    target: `#${FAIL_GROUPS_ID}`,
    content: '통계 화면이에요. 지난달과 비교해 어떤 실패가 반복되고, 새로 생기고, 줄고 있는지 보여요',
  },
  {target: `#${FIRST_TAG_ROW_ID}`, content: '태그를 누르면 그 실패만 모아 볼 수 있어요'},
  {
    target: `#${TAG_CALENDAR_SECTION_ID}`,
    content: '이 실패를 한 날이 달력에 보여요. 아래에서 달마다 추이도 볼 수 있어요',
    before: async () => {
      if (!document.getElementById(TAG_CALENDAR_SECTION_ID)) {
        document.getElementById(FIRST_TAG_ROW_ID)?.click();
      }
      await waitForElement(TAG_CALENDAR_SECTION_ID);
    },
    skipScroll: false,
    placement: 'top',
  },
];

const STATS_TOUR_FIRST_NUMBER = 3;

function StatsTourBubble({index, step, primaryProps, closeProps}: TooltipRenderProps) {
  return (
    <TourBubble
      buttonProps={{primary: primaryProps, close: closeProps}}
      content={step.content}
      number={index + STATS_TOUR_FIRST_NUMBER}
    />
  );
}

/* joyride는 before가 끝나면 대상을 기다리지 않고 바로 찾아, 그때 없으면 그 말풍선을 건너뛴다 */
function waitForElement(id: string) {
  const startedAt = Date.now();

  return new Promise<void>((resolve) => {
    const check = () => {
      if (document.getElementById(id) || Date.now() - startedAt > ELEMENT_WAIT_TIMEOUT_MS) {
        resolve();
        return;
      }
      setTimeout(check, ELEMENT_WAIT_INTERVAL_MS);
    };
    check();
  });
}

const ELEMENT_WAIT_TIMEOUT_MS = 1000;
const ELEMENT_WAIT_INTERVAL_MS = 16;
