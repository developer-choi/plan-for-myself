import {useRef} from 'react';
import type {View} from 'react-native';
import {type CalendarMonth, parseDateParam} from '@plan-for-myself/shared/date';
import {type DemoOverview, demoStatsPath} from '@plan-for-myself/shared/demo';
import {findFirstRecordDateOfMonth, type StudyRecord} from '@plan-for-myself/shared/study-record';
import DemoTourTrigger from '@/demo/components/DemoTourTrigger';
import useOpenDemoChoiceDialog from '@/demo/useOpenDemoChoiceDialog';
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
  const firstRecordCellRef = useRef<View>(null);
  const statsLinkRef = useRef<View>(null);
  const demoMonth = parseDateParam(today);
  const firstRecordDateOfDemoMonth = findFirstRecordDateOfMonth(records, demoMonth);
  const tourTargets =
    firstRecordDateOfDemoMonth === undefined
      ? undefined
      : {firstRecordCell: {date: firstRecordDateOfDemoMonth, ref: firstRecordCellRef}, statsLinkRef};

  return (
    <>
      <CalendarSection
        firstRecordDate={firstRecordDate}
        handlers={{onRecordableDateClick: openChoiceDialog}}
        month={month}
        records={records}
        statsHref={demoStatsPath(month)}
        today={today}
        tourTargets={tourTargets}
      />
      {tourTargets && <DemoTourTrigger month={demoMonth} part="calendar" targets={tourTargets} />}
    </>
  );
}
