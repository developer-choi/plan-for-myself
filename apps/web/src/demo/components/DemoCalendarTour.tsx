'use client';

import type {CalendarMonth} from '@plan-for-myself/shared/date';
import {DEMO_CALENDAR_TOUR_STEPS, type DemoCalendarTourTarget, demoStatsPath} from '@plan-for-myself/shared/demo';
import {useRouter} from 'next/navigation';
import {ACTIONS, type EventData, EVENTS, Joyride, type Step, type TooltipRenderProps} from 'react-joyride';
import TourBubble from '@/demo/components/TourBubble';
import {
  DEMO_CALENDAR_TOUR_LOCALE,
  DEMO_TOUR_FLOATING_OPTIONS,
  DEMO_TOUR_OPTIONS,
  DEMO_TOUR_STYLES,
} from '@/demo/demo-tour';
import {CALENDAR_STATS_LINK_ID} from '@/study-record/components/CalendarSummary';

/* 서버가 달력을 그린 달을 받는다 — 여기서 다시 계산하면 달 경계에서 서버가 그린 달과 어긋나 1/5 대상이 없다 */
export interface DemoCalendarTourProps {
  demoMonth: CalendarMonth;
  firstRecordDate: string;
}

export default function DemoCalendarTour({demoMonth, firstRecordDate}: DemoCalendarTourProps) {
  const router = useRouter();
  const steps = createCalendarTourSteps(firstRecordDate);

  const handleEvent = (data: EventData) => {
    const isNextOnLastStep =
      data.type === EVENTS.STEP_AFTER && data.action === ACTIONS.NEXT && data.index === steps.length - 1;

    if (isNextOnLastStep) {
      router.push(demoStatsPath(demoMonth));
    }
  };

  return (
    <Joyride
      continuous
      run
      floatingOptions={DEMO_TOUR_FLOATING_OPTIONS}
      locale={DEMO_CALENDAR_TOUR_LOCALE}
      options={DEMO_TOUR_OPTIONS}
      steps={steps}
      styles={DEMO_TOUR_STYLES}
      tooltipComponent={CalendarTourBubble}
      onEvent={handleEvent}
    />
  );
}

function createCalendarTourSteps(firstRecordDate: string): Step[] {
  const targets: Record<DemoCalendarTourTarget, string> = {
    firstRecordDate: `button:has(> time[datetime="${firstRecordDate}"])`,
    statsLink: `#${CALENDAR_STATS_LINK_ID}`,
  };

  return DEMO_CALENDAR_TOUR_STEPS.map(({target, content}) => ({target: targets[target], content}));
}

function CalendarTourBubble({index, step, primaryProps, closeProps}: TooltipRenderProps) {
  return (
    <TourBubble buttonProps={{primary: primaryProps, close: closeProps}} content={step.content} number={index + 1} />
  );
}
