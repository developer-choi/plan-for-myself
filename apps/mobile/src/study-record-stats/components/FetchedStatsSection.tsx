import {type ReactNode, type RefObject, Suspense} from 'react';
import {type CalendarMonth, isSameMonth, type StudyRecordMonthly, toMonthParam} from '@plan-for-myself/shared';
import {useSuspenseQuery} from '@tanstack/react-query';
import type {ScrollView} from 'react-native';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import {studyRecordStatsQueries} from '@/study-record/queries';
import FetchedTagCalendar from '@/study-record-stats/components/FetchedTagCalendar';
import StatsSection from '@/study-record-stats/components/StatsSection';

interface FetchedStatsSectionProps {
  month: CalendarMonth;
  today: string;
  scrollViewRef: RefObject<ScrollView | null>;
}

interface CurrentMonthStatsSectionProps {
  today: string;
  monthly: StudyRecordMonthly;
  renderTagCalendar: (tag: string) => ReactNode;
  scrollViewRef: RefObject<ScrollView | null>;
}

interface BoundedFetchedTagCalendarProps {
  month: CalendarMonth;
  tag: string;
}

export default function FetchedStatsSection({month, today, scrollViewRef}: FetchedStatsSectionProps) {
  const {data: monthly} = useSuspenseQuery(studyRecordStatsQueries.monthly.options(toMonthParam(month), today));
  const renderTagCalendar = (tag: string) => <BoundedFetchedTagCalendar month={month} tag={tag} />;

  if (isSameMonth(today, month)) {
    return (
      <CurrentMonthStatsSection
        monthly={monthly}
        renderTagCalendar={renderTagCalendar}
        scrollViewRef={scrollViewRef}
        today={today}
      />
    );
  }

  return (
    <StatsSection
      monthly={monthly}
      overview={null}
      renderTagCalendar={renderTagCalendar}
      scrollViewRef={scrollViewRef}
    />
  );
}

function CurrentMonthStatsSection({today, monthly, renderTagCalendar, scrollViewRef}: CurrentMonthStatsSectionProps) {
  const {data: overview} = useSuspenseQuery(studyRecordStatsQueries.overview.options(today));

  return (
    <StatsSection
      monthly={monthly}
      overview={overview}
      renderTagCalendar={renderTagCalendar}
      scrollViewRef={scrollViewRef}
    />
  );
}

function BoundedFetchedTagCalendar({month, tag}: BoundedFetchedTagCalendarProps) {
  return (
    <HandledErrorBoundary size="card">
      <Suspense fallback={<LoadingSpinner size="card" />}>
        <FetchedTagCalendar month={month} tag={tag} />
      </Suspense>
    </HandledErrorBoundary>
  );
}
