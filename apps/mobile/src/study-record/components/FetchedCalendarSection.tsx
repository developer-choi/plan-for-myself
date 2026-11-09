import {type CalendarMonth, toMonthParam} from '@plan-for-myself/shared';
import {useSuspenseQuery} from '@tanstack/react-query';
import CalendarSection from '@/study-record/components/CalendarSection';
import {studyRecordQueries} from '@/study-record/queries';

interface FetchedCalendarSectionProps {
  month: CalendarMonth;
  today: string;
}

export default function FetchedCalendarSection({month, today}: FetchedCalendarSectionProps) {
  const {data: records} = useSuspenseQuery(studyRecordQueries.list.options(toMonthParam(month)));

  return <CalendarSection month={month} records={records} today={today} />;
}
