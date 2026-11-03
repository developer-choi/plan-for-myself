'use client';

import {DEMO_STATS_TOUR_FIRST_NUMBER, DEMO_STATS_TOUR_STEPS, type DemoStatsTourTarget} from '@plan-for-myself/shared';
import {ACTIONS, type EventData, EVENTS, Joyride, type Step, type TooltipRenderProps} from 'react-joyride';
import TourBubble from '@/demo/components/TourBubble';
import {DEMO_TOUR_FLOATING_OPTIONS, DEMO_TOUR_LOCALE, DEMO_TOUR_OPTIONS, DEMO_TOUR_STYLES} from '@/demo/demo-tour';
import {useOpenDemoChoiceDialog} from '@/demo/useOpenDemoChoiceDialog';
import {FAIL_GROUPS_ID, FIRST_TAG_ROW_ID} from '@/study-record-stats/components/FailCard';
import {TAG_DETAIL_CARD_ID} from '@/study-record-stats/components/TagDetailCard';

export default function DemoStatsTour() {
  const openChoiceDialog = useOpenDemoChoiceDialog('tour-end');

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

const STATS_TOUR_STEP_OPTIONS: Record<DemoStatsTourTarget, Omit<Step, 'content'>> = {
  failGroups: {
    target: `#${FAIL_GROUPS_ID}`,
  },
  firstTagRow: {
    target: `#${FIRST_TAG_ROW_ID}`,
    /* 묶음 제목이 태그 줄 바로 위 4px에 있어, 기본 여백(10px)이면 하이라이트가 제목을 반쯤 자른다 */
    spotlightPadding: 4,
  },
  tagDetailCard: {
    target: `#${TAG_DETAIL_CARD_ID}`,
    before: async () => {
      if (!document.getElementById(TAG_DETAIL_CARD_ID)) {
        document.getElementById(FIRST_TAG_ROW_ID)?.click();
      }
      await waitForElement(TAG_DETAIL_CARD_ID);
    },
    skipScroll: false,
    placement: 'top',
  },
};

const STATS_TOUR_STEPS: Step[] = DEMO_STATS_TOUR_STEPS.map(({target, content}) => ({
  ...STATS_TOUR_STEP_OPTIONS[target],
  content,
}));

function StatsTourBubble({index, step, primaryProps, closeProps}: TooltipRenderProps) {
  return (
    <TourBubble
      buttonProps={{primary: primaryProps, close: closeProps}}
      content={step.content}
      number={index + DEMO_STATS_TOUR_FIRST_NUMBER}
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
