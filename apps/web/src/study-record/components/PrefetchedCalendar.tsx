import {type CalendarMonth, toMonthParam} from '@plan-for-myself/shared/date';
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
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
