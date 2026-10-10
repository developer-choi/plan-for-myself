import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import DemoStatsSection from '@/demo/components/DemoStatsSection';
import {DEMO_OVERVIEW, DEMO_RECORDS, DEMO_TODAY, getDemoMonthly} from '@/demo/demo-examples';
import ErrorNotice from '@/shared/components/ErrorNotice';
import PageColumn from '@/shared/components/PageColumn';
import PageShell from '@/shared/components/PageShell';
import SubPageHeader from '@/shared/components/SubPageHeader';
import {isFutureMonth, isSameMonth, parseMonth} from '@/study-record/calendar-date';
import {formatStatsTitle} from '@/study-record-stats/format';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{year: string; month: string}>;
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

  return (
    <PageShell>
      <PageColumn>
        <SubPageHeader title={formatStatsTitle(viewMonth)} />
        <main className={styles.body}>
          {isFutureMonth(DEMO_TODAY, viewMonth) ? (
            <div className={styles.notice}>
              <ErrorNotice content="오늘까지의 달만 통계를 볼 수 있어요" title="미래 달은 조회할 수 없어요" />
            </div>
          ) : (
            <DemoStatsSection
              month={viewMonth}
              monthly={getDemoMonthly(viewMonth)}
              overview={isSameMonth(DEMO_TODAY, viewMonth) ? DEMO_OVERVIEW : null}
              records={DEMO_RECORDS}
              today={DEMO_TODAY}
            />
          )}
        </main>
      </PageColumn>
    </PageShell>
  );
}
