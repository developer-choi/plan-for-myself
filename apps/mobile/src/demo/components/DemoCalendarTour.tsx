import {useRouter} from 'expo-router';
import {
  type CalendarMonth,
  DEMO_CALENDAR_TOUR_STEPS,
  DEMO_TOUR_BUTTON_LABELS,
  type DemoCalendarTourTarget,
  demoStatsPath,
} from '@plan-for-myself/shared';
import DemoTour from '@/demo/components/DemoTour';
import type {DemoTourStep} from '@/demo/useDemoTour';
import type {CalendarTourTargets} from '@/study-record/components/CalendarSection';

export interface DemoCalendarTourTargets {
  month: CalendarMonth;
  targets: CalendarTourTargets;
}

interface DemoCalendarTourProps extends DemoCalendarTourTargets {
  isOpen: boolean;
  handlers: {
    onClose: () => void;
  };
}

export default function DemoCalendarTour({month, targets, isOpen, handlers: {onClose}}: DemoCalendarTourProps) {
  const router = useRouter();
  const stepRefs: Record<DemoCalendarTourTarget, DemoTourStep['targetRef']> = {
    firstRecordDate: targets.firstRecordCell.ref,
    statsLink: targets.statsLinkRef,
  };
  const steps = DEMO_CALENDAR_TOUR_STEPS.map(({target, content}) => ({content, targetRef: stepRefs[target]}));

  return (
    <DemoTour
      firstNumber={1}
      handlers={{onClose, onFinish: () => router.push(demoStatsPath(month))}}
      isOpen={isOpen}
      lastLabel={DEMO_TOUR_BUTTON_LABELS.next}
      steps={steps}
    />
  );
}
