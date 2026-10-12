'use client';

import type {StudyRecord} from '@plan-for-myself/shared';
import type {DemoOverview} from '@/demo/demo-examples';
import {demoStatsPath} from '@/demo/demo-path';
import {useOpenDemoChoiceDialog} from '@/demo/useOpenDemoChoiceDialog';
import type {CalendarMonth} from '@/study-record/calendar-date';
import CalendarSection from '@/study-record/components/CalendarSection';

interface DemoCalendarSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  overview: DemoOverview;
}

export default function DemoCalendarSection({month, today, records, overview}: DemoCalendarSectionProps) {
  const {firstRecordDate} = overview;

  const openChoiceDialog = useOpenDemoChoiceDialog();

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
