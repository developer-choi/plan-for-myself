'use client';

import type {StudyRecord} from '@plan-for-myself/shared';
import {overlay} from 'overlay-kit';
import DemoChoiceDialog from '@/demo/components/DemoChoiceDialog';
import type {DemoOverview} from '@/demo/demo-examples';
import {demoStatsPath} from '@/demo/demo-path';
import type {CalendarMonth} from '@/study-record/calendar-date';
import CalendarSection from '@/study-record/components/CalendarSection';

interface DemoCalendarSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  overview: DemoOverview;
}

export default function DemoCalendarSection({month, today, records, overview}: DemoCalendarSectionProps) {
  const {firstRecordDate, streak} = overview;

  const openChoiceDialog = () => {
    overlay.open(({isOpen, unmount}) => <DemoChoiceDialog isOpen={isOpen} onClose={unmount} />);
  };

  return (
    <CalendarSection
      firstRecordDate={firstRecordDate}
      handlers={{onRecordableDateClick: openChoiceDialog}}
      month={month}
      records={records}
      statsHref={demoStatsPath(month)}
      streak={streak.current}
      today={today}
    />
  );
}
