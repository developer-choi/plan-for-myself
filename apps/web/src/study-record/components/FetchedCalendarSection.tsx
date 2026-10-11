'use client';

import type {StudyRecord} from '@plan-for-myself/shared';
import {useSuspenseQueries} from '@tanstack/react-query';
import {overlay} from 'overlay-kit';
import {type CalendarMonth, statsPath, toMonthParam} from '@/study-record/calendar-date';
import CalendarSection from '@/study-record/components/CalendarSection';
import FirstRecord from '@/study-record/components/FirstRecord';
import RecordFormDialog from '@/study-record/components/RecordFormDialog';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';

interface FetchedCalendarSectionProps {
  month: CalendarMonth;
  today: string;
}

export default function FetchedCalendarSection({month, today}: FetchedCalendarSectionProps) {
  const [{data: records}, {data: overview}] = useSuspenseQueries({
    queries: [studyRecordQueries.list.options(toMonthParam(month)), studyRecordStatsQueries.overview.options(today)],
  });
  const {firstRecordDate, streak} = overview;

  if (firstRecordDate === null) {
    return <FirstRecord today={today} />;
  }

  const openRecordForm = (date: string, record?: StudyRecord) => {
    overlay.open(({isOpen, unmount}) => (
      <RecordFormDialog date={date} isOpen={isOpen} month={toMonthParam(month)} record={record} onClose={unmount} />
    ));
  };

  return (
    <CalendarSection
      firstRecordDate={firstRecordDate}
      handlers={{onRecordableDateClick: openRecordForm}}
      month={month}
      records={records}
      statsHref={statsPath(month)}
      streak={streak.current}
      today={today}
    />
  );
}
