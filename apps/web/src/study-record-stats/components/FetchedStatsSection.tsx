'use client';

import type {StudyRecordMonthly} from '@plan-for-myself/shared';
import {Suspense} from 'react';
import {useSuspenseQuery} from '@tanstack/react-query';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import {type CalendarMonth, isSameMonth, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordStatsQueries} from '@/study-record/queries';
import FetchedTagCalendar from '@/study-record-stats/components/FetchedTagCalendar';
import StatsSection from '@/study-record-stats/components/StatsSection';

interface FetchedStatsSectionProps {
  month: CalendarMonth;
  today: string;
}

interface CurrentMonthStatsSectionProps extends FetchedStatsSectionProps {
  monthly: StudyRecordMonthly;
}

interface BoundedFetchedTagCalendarProps {
  month: CalendarMonth;
  today: string;
  tag: string;
}

export default function FetchedStatsSection({month, today}: FetchedStatsSectionProps) {
  const {data: monthly} = useSuspenseQuery(studyRecordStatsQueries.monthly.options(toMonthParam(month), today));

  if (isSameMonth(today, month)) {
    return <CurrentMonthStatsSection month={month} monthly={monthly} today={today} />;
  }

  return (
    <StatsSection
      month={month}
      monthly={monthly}
      overview={null}
      renderTagCalendar={(tag) => <BoundedFetchedTagCalendar month={month} tag={tag} today={today} />}
    />
  );
}

function CurrentMonthStatsSection({month, today, monthly}: CurrentMonthStatsSectionProps) {
  const {data: overview} = useSuspenseQuery(studyRecordStatsQueries.overview.options(today));

  return (
    <StatsSection
      month={month}
      monthly={monthly}
      overview={overview}
      renderTagCalendar={(tag) => <BoundedFetchedTagCalendar month={month} tag={tag} today={today} />}
    />
  );
}

function BoundedFetchedTagCalendar({month, today, tag}: BoundedFetchedTagCalendarProps) {
  return (
    <HandledErrorBoundary size="card">
      <Suspense fallback={<LoadingSpinner size="card" />}>
        <FetchedTagCalendar month={month} tag={tag} today={today} />
      </Suspense>
    </HandledErrorBoundary>
  );
}
