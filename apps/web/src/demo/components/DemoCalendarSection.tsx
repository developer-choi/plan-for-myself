'use client';

import type {CalendarMonth} from '@plan-for-myself/shared/date';
import {type DemoOverview, demoStatsPath} from '@plan-for-myself/shared/demo';
import type {StudyRecord} from '@plan-for-myself/shared/study-record';
import {useOpenDemoChoiceDialog} from '@/demo/useOpenDemoChoiceDialog';
import CalendarSection from '@/study-record/components/CalendarSection';

interface DemoCalendarSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  overview: DemoOverview;
}

export default function DemoCalendarSection({month, today, records, overview}: DemoCalendarSectionProps) {
  const {firstRecordDate} = overview;

  const openChoiceDialog = useOpenDemoChoiceDialog('date-click');

  return (
    <CalendarSection
      firstRecordDate={firstRecordDate}
      handlers={{onRecordableDateClick: openChoiceDialog}}
      month={month}
      records={records}
      statsHref={demoStatsPath(month)}
      today={today}
    />
  );
}
