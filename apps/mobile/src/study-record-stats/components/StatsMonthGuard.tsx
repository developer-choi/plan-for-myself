import type {PropsWithChildren} from 'react';
import {type CalendarMonth, toMonthParam} from '@plan-for-myself/shared/date';
import {isBeforeFirstRecord} from '@plan-for-myself/shared/study-record-stats';
import {usePrefetchQuery, useQuery, useSuspenseQuery} from '@tanstack/react-query';
import {Redirect} from 'expo-router';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';
import ThisMonthStatsRedirect from '@/study-record-stats/components/ThisMonthStatsRedirect';

interface StatsMonthGuardProps extends PropsWithChildren {
  month: CalendarMonth;
  today: string;
}

export default function StatsMonthGuard({month, today, children}: StatsMonthGuardProps) {
  const recordsOptions = studyRecordQueries.list.options(toMonthParam(month));
  usePrefetchQuery(studyRecordStatsQueries.monthly.options(toMonthParam(month), today));
  usePrefetchQuery(recordsOptions);
  const {data: overview} = useSuspenseQuery(studyRecordStatsQueries.overview.options(today));
  const {isFetched: isRecordsFetched} = useQuery(recordsOptions);

  if (overview.firstRecordDate === null) {
    return <Redirect href="/" />;
  }

  if (isBeforeFirstRecord(month, overview.firstRecordDate)) {
    return <ThisMonthStatsRedirect today={today} />;
  }

  if (!isRecordsFetched) {
    return <LoadingSpinner />;
  }

  return children;
}
