import {
  DEMO_STATS_TOUR_FIRST_NUMBER,
  DEMO_STATS_TOUR_STEPS,
  DEMO_TOUR_BUTTON_LABELS,
  type DemoStatsTourTarget,
} from '@plan-for-myself/shared/demo';
import DemoTour from '@/demo/components/DemoTour';
import {TOUR_BUBBLE_TWO_LINE_HEIGHT} from '@/demo/components/TourBubble';
import {TOUR_BUBBLE_GAP} from '@/demo/demo-tour-geometry';
import type {DemoTourStep} from '@/demo/useDemoTour';
import useOpenDemoChoiceDialog from '@/demo/useOpenDemoChoiceDialog';
import type {StatsTourTargets} from '@/study-record-stats/components/StatsSection';

export interface DemoStatsTourTargets {
  targets: StatsTourTargets;
}

interface DemoStatsTourProps extends DemoStatsTourTargets {
  isOpen: boolean;
  handlers: {
    onClose: () => void;
  };
}

export default function DemoStatsTour({targets, isOpen, handlers: {onClose}}: DemoStatsTourProps) {
  const openChoiceDialog = useOpenDemoChoiceDialog('tour-end');
  const stepOptions: Record<DemoStatsTourTarget, Omit<DemoTourStep, 'content'>> = {
    failGroups: {targetRef: targets.failGroupsRef},
    firstTagRow: {
      targetRef: targets.firstTagRowRef,
      /* 묶음 제목이 태그 줄 바로 위 4에 있어, 기본 여백(10)이면 구멍이 제목을 반쯤 자른다 */
      spotlightPadding: 4,
    },
    tagDetailCard: {
      targetRef: targets.tagDetailCardRef,
      placement: 'top',
      beforeMeasure: () => targets.firstTagOpenerRef.current?.openFirstTag(TAG_DETAIL_SCROLL_ROOM),
    },
  };
  const steps = DEMO_STATS_TOUR_STEPS.map(({target, content}) => ({...stepOptions[target], content}));

  return (
    <DemoTour
      firstNumber={DEMO_STATS_TOUR_FIRST_NUMBER}
      handlers={{onClose, onFinish: openChoiceDialog}}
      isOpen={isOpen}
      lastLabel={DEMO_TOUR_BUTTON_LABELS.last}
      steps={steps}
    />
  );
}

const TAG_DETAIL_SCROLL_ROOM = TOUR_BUBBLE_TWO_LINE_HEIGHT + TOUR_BUBBLE_GAP;
