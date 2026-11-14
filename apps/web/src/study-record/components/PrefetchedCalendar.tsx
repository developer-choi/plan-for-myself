import type {ReactNode} from 'react';
import {type CalendarMonth, toMonthParam} from '@plan-for-myself/shared/date';
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query';
import FetchedCalendarSection from '@/study-record/components/FetchedCalendarSection';
import {serverStudyRecordQueries, serverStudyRecordStatsQueries} from '@/study-record/server-queries';

interface PrefetchedCalendarProps {
  month: CalendarMonth;
  today: string;
  children?: ReactNode;
}

export default async function PrefetchedCalendar({month, today, children}: PrefetchedCalendarProps) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.query(serverStudyRecordQueries.list.options(toMonthParam(month))),
    queryClient.query(serverStudyRecordStatsQueries.overview.options(today)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FetchedCalendarSection month={month} today={today} />
      {children}
    </HydrationBoundary>
  );
}
