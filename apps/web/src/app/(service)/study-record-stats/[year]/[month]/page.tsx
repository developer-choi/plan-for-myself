import {Suspense} from 'react';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {dehydrate, HydrationBoundary, noop, QueryClient} from '@tanstack/react-query';
import {getKoreanToday} from '@plan-for-myself/shared';
import ErrorNotice from '@/shared/components/ErrorNotice';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import PageShell from '@/shared/components/PageShell';
import SubPageHeader from '@/shared/components/SubPageHeader';
import {type CalendarMonth, isFutureMonth, isSameMonth, parseMonth, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';
import StatsSection from '@/study-record-stats/components/StatsSection';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{year: string; month: string}>;
}

interface PrefetchedStatsProps {
  month: CalendarMonth;
  today: string;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const viewMonth = parseMonth(await params);

  return viewMonth ? {title: statsTitle(viewMonth)} : {};
}

export default async function Page({params}: PageProps) {
  const viewMonth = parseMonth(await params);

  if (!viewMonth) {
    notFound();
  }

  const today = getKoreanToday();

  return (
    <PageShell>
      <SubPageHeader title={statsTitle(viewMonth)} />
      <main className={styles.body}>
        {isFutureMonth(today, viewMonth) ? (
          <div className={styles.notice}>
            <ErrorNotice content="오늘까지의 달만 통계를 볼 수 있어요" title="미래 달은 조회할 수 없어요" />
          </div>
        ) : (
          <HandledErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <PrefetchedStats month={viewMonth} today={today} />
            </Suspense>
          </HandledErrorBoundary>
        )}
      </main>
    </PageShell>
  );
}

async function PrefetchedStats({month, today}: PrefetchedStatsProps) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.query(studyRecordStatsQueries.monthly.options(toMonthParam(month), today)),
    isSameMonth(today, month) ? queryClient.query(studyRecordStatsQueries.overview.options(today)) : undefined,
    queryClient.query(studyRecordQueries.list.options(toMonthParam(month))).catch(noop),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatsSection month={month} today={today} />
    </HydrationBoundary>
  );
}

function statsTitle({year, month}: CalendarMonth) {
  return `${year}년 ${month}월 통계`;
}
