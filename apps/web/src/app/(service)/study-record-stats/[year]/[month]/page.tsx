import {Suspense} from 'react';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {dehydrate, HydrationBoundary, noop, QueryClient} from '@tanstack/react-query';
import {getKoreanToday} from '@plan-for-myself/shared';
import ErrorNotice from '@/shared/components/ErrorNotice';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import layout from '@/shared/styles/layout.module.scss';
import {type CalendarMonth, isFutureMonth, parseMonth, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';
import FetchedStatsSection from '@/study-record-stats/components/FetchedStatsSection';
import StatsPageHeader from '@/study-record-stats/components/StatsPageHeader';
import {formatStatsTitle} from '@/study-record-stats/format';
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

  return viewMonth ? {title: formatStatsTitle(viewMonth)} : {};
}

export default async function Page({params}: PageProps) {
  const viewMonth = parseMonth(await params);

  if (!viewMonth) {
    notFound();
  }

  const today = getKoreanToday();

  const headerWithoutNavigation = <StatsPageHeader firstRecordDate={null} month={viewMonth} today={today} />;

  return (
    <div className={layout.shell}>
      <div className={layout.centered}>
        {isFutureMonth(today, viewMonth) ? (
          <>
            {headerWithoutNavigation}
            <main className={styles.body}>
              <div className={styles.notice}>
                <ErrorNotice content="오늘까지의 달만 통계를 볼 수 있어요" title="미래 달은 조회할 수 없어요" />
              </div>
            </main>
          </>
        ) : (
          <Suspense
            fallback={
              <>
                {headerWithoutNavigation}
                <main className={styles.body}>
                  <LoadingSpinner />
                </main>
              </>
            }
          >
            <PrefetchedStats month={viewMonth} today={today} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

/* 머리가 첫 기록 날짜를 쓰므로 머리까지 HydrationBoundary 안에 둔다. 받기에 실패해도 던지지 않아야 오류가 나도 머리(나갈 길)가 남는다 */
async function PrefetchedStats({month, today}: PrefetchedStatsProps) {
  const queryClient = new QueryClient();
  const overviewOptions = studyRecordStatsQueries.overview.options(today);

  await Promise.all([
    queryClient.query(studyRecordStatsQueries.monthly.options(toMonthParam(month), today)).catch(noop),
    queryClient.query(overviewOptions).catch(noop),
    queryClient.query(studyRecordQueries.list.options(toMonthParam(month))).catch(noop),
  ]);

  const firstRecordDate = queryClient.getQueryData(overviewOptions.queryKey)?.firstRecordDate ?? null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatsPageHeader firstRecordDate={firstRecordDate} month={month} today={today} />
      <main className={styles.body}>
        <HandledErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <FetchedStatsSection month={month} today={today} />
          </Suspense>
        </HandledErrorBoundary>
      </main>
    </HydrationBoundary>
  );
}
