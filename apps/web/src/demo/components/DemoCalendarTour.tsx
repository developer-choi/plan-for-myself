'use client';

import {useRouter} from 'next/navigation';
import {ACTIONS, type EventData, EVENTS, Joyride, type Step, type TooltipRenderProps} from 'react-joyride';
import TourBubble from '@/demo/components/TourBubble';
import {DEMO_MONTH, DEMO_RECORDS} from '@/demo/demo-examples';
import {demoStatsPath} from '@/demo/demo-path';
import {DEMO_TOUR_FLOATING_OPTIONS, DEMO_TOUR_LOCALE, DEMO_TOUR_OPTIONS, DEMO_TOUR_STYLES} from '@/demo/demo-tour';
import {isSameMonth} from '@/study-record/calendar-date';
import {CALENDAR_STATS_LINK_ID} from '@/study-record/components/CalendarSummary';

export default function DemoCalendarTour() {
  const router = useRouter();

  const handleEvent = (data: EventData) => {
    const isNextOnLastStep =
      data.type === EVENTS.STEP_AFTER && data.action === ACTIONS.NEXT && data.index === CALENDAR_TOUR_STEPS.length - 1;

    if (isNextOnLastStep) {
      router.push(demoStatsPath(DEMO_MONTH));
    }
  };

  return (
    <Joyride
      continuous
      run
      floatingOptions={DEMO_TOUR_FLOATING_OPTIONS}
      locale={DEMO_TOUR_LOCALE}
      options={DEMO_TOUR_OPTIONS}
      steps={CALENDAR_TOUR_STEPS}
      styles={DEMO_TOUR_STYLES}
      tooltipComponent={CalendarTourBubble}
      onEvent={handleEvent}
    />
  );
}

const FIRST_RECORD_DATE_OF_DEMO_MONTH = DEMO_RECORDS.filter((record) => isSameMonth(record.date, DEMO_MONTH))[0].date;

const CALENDAR_TOUR_STEPS: Step[] = [
  {
    target: `button:has(> time[datetime="${FIRST_RECORD_DATE_OF_DEMO_MONTH}"])`,
    content: '작성한 공부시간과 실패가 여기 보여요',
  },
  {target: `#${CALENDAR_STATS_LINK_ID}`, content: '누르면 통계를 볼 수 있어요'},
];

function CalendarTourBubble({index, step, primaryProps, closeProps}: TooltipRenderProps) {
  return (
    <TourBubble buttonProps={{primary: primaryProps, close: closeProps}} content={step.content} number={index + 1} />
  );
}
