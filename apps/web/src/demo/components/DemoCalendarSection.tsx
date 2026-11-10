'use client';

import {type CalendarMonth, type DemoOverview, demoStatsPath, type StudyRecord} from '@plan-for-myself/shared';
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
