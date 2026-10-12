import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import DemoStatsSection from '@/demo/components/DemoStatsSection';
import DemoTourTrigger from '@/demo/components/DemoTourTrigger';
import {getDemoMonthly, getDemoOverview, getDemoRecords, getDemoToday} from '@/demo/demo-examples';
import ErrorNotice from '@/shared/components/ErrorNotice';
import SubPageHeader from '@/shared/components/SubPageHeader';
import layout from '@/shared/styles/layout.module.scss';
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

  const now = new Date();
  const today = getDemoToday(now);
  const monthly = isFutureMonth(today, viewMonth) ? null : getDemoMonthly(viewMonth, now);

  return (
    <div className={layout.shell}>
      <div className={layout.centered}>
        <SubPageHeader title={formatStatsTitle(viewMonth)} />
        <main className={styles.body}>
          {monthly === null ? (
            <div className={styles.notice}>
              <ErrorNotice content="오늘까지의 달만 통계를 볼 수 있어요" title="미래 달은 조회할 수 없어요" />
            </div>
          ) : (
            <DemoStatsSection
              month={viewMonth}
              monthly={monthly}
              overview={isSameMonth(today, viewMonth) ? getDemoOverview(now) : null}
              records={getDemoRecords(now)}
            />
          )}
        </main>
      </div>
      {/* 투어가 짚는 실패 카드 묶음이 없는 달에서는 띄우지 않는다 — 말풍선 없이 끝나도 「봤음」으로 찍혀 다시 안 뜬다 */}
      {monthly !== null && monthly.failureTags.length > 0 && <DemoTourTrigger part="stats" />}
    </div>
  );
}
