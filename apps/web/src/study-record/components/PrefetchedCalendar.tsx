import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import {type CalendarMonth, toMonthParam} from '@/study-record/calendar-date';
import CalendarSection from '@/study-record/components/CalendarSection';
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
      <CalendarSection month={month} today={today} />
    </HydrationBoundary>
  );
}
