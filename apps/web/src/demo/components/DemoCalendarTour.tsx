'use client';

import {useRouter} from 'next/navigation';
import {ACTIONS, type EventData, EVENTS, Joyride, type Step, type TooltipRenderProps} from 'react-joyride';
import TourBubble from '@/demo/components/TourBubble';
import {demoStatsPath} from '@/demo/demo-path';
import {
  DEMO_CALENDAR_TOUR_LOCALE,
  DEMO_TOUR_FLOATING_OPTIONS,
  DEMO_TOUR_OPTIONS,
  DEMO_TOUR_STYLES,
} from '@/demo/demo-tour';
import type {CalendarMonth} from '@/study-record/calendar-date';
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
  return [
    {
      target: `button:has(> time[datetime="${firstRecordDate}"])`,
      content: '실패와 공부시간이 여기 보여요',
    },
    {
      target: `#${CALENDAR_STATS_LINK_ID}`,
      content: '여기서 통계를 볼 수 있어요. 「다음」을 누르면 통계 화면으로 넘어가요',
    },
  ];
}

function CalendarTourBubble({index, step, primaryProps, closeProps}: TooltipRenderProps) {
  return (
    <TourBubble buttonProps={{primary: primaryProps, close: closeProps}} content={step.content} number={index + 1} />
  );
}
