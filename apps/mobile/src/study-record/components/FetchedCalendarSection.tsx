import {type CalendarMonth, type StudyRecord, toMonthParam} from '@plan-for-myself/shared';
import {openOnce} from '@plan-for-myself/shared/react';
import {useSuspenseQuery} from '@tanstack/react-query';
import CalendarSection from '@/study-record/components/CalendarSection';
import RecordFormDialog from '@/study-record/components/RecordFormDialog';
import {studyRecordQueries} from '@/study-record/queries';

interface FetchedCalendarSectionProps {
  month: CalendarMonth;
  today: string;
}

export default function FetchedCalendarSection({month, today}: FetchedCalendarSectionProps) {
  const {data: records} = useSuspenseQuery(studyRecordQueries.list.options(toMonthParam(month)));

  const openRecordForm = (date: string, record?: StudyRecord) => {
    openOnce('record-form', ({isOpen, unmount}) => (
      <RecordFormDialog date={date} isOpen={isOpen} month={toMonthParam(month)} record={record} onClose={unmount} />
    ));
  };

  return (
    <CalendarSection handlers={{onRecordableDateClick: openRecordForm}} month={month} records={records} today={today} />
  );
}
