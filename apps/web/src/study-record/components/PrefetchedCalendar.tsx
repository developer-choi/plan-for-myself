import type {CalendarMonth} from '@plan-for-myself/shared';
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import {toMonthParam} from '@/study-record/calendar-date';
import FetchedCalendarSection from '@/study-record/components/FetchedCalendarSection';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';

interface PrefetchedCalendarProps {
  month: CalendarMonth;
  today: string;
}

export default async function PrefetchedCalendar({month, today}: PrefetchedCalendarProps) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.query(studyRecordQueries.list.options(toMonthParam(month))),
    queryClient.query(studyRecordStatsQueries.overview.options(today)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FetchedCalendarSection month={month} today={today} />
    </HydrationBoundary>
  );
}
