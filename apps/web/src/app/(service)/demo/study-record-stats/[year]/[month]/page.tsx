import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import classNames from 'classnames';
import {CalendarIcon} from '@radix-ui/react-icons';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import DemoBanner from '@/demo/components/DemoBanner';
import DemoStatsSection from '@/demo/components/DemoStatsSection';
import DemoTourTrigger from '@/demo/components/DemoTourTrigger';
import {type DemoOverview, getDemoMonthly, getDemoOverview, getDemoRecords, getDemoToday} from '@/demo/demo-examples';
import {demoCalendarPath, demoStatsPath} from '@/demo/demo-path';
import {getStatsMonthNavigation, isBeforeFirstRecord} from '@/study-record-stats/month-navigation';
import SubPageHeader from '@/shared/components/SubPageHeader';
import layout from '@/shared/styles/layout.module.scss';
import {type CalendarMonth, isFutureMonth, isSameMonth, parseMonth} from '@/study-record/calendar-date';
import {formatStatsTitle} from '@/study-record-stats/format';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{year: string; month: string}>;
}

interface DemoStatsMonth {
  viewMonth: CalendarMonth;
  today: string;
  overview: DemoOverview;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const demoMonth = parseDemoStatsMonth(await params, new Date());

  return demoMonth ? {title: formatStatsTitle(demoMonth.viewMonth)} : {};
}

export default async function Page({params}: PageProps) {
  const now = new Date();
  const demoMonth = parseDemoStatsMonth(await params, now);

  if (!demoMonth) {
    notFound();
  }

  const {viewMonth, today, overview} = demoMonth;

  const isLoggedIn = getLoginState(await auth()) !== 'logged-out';
  const monthly = getDemoMonthly(viewMonth, now);
  const {previous, next} = getStatsMonthNavigation({
    today,
    month: viewMonth,
    firstRecordDate: overview.firstRecordDate,
  });

  return (
    <div className={layout.shell}>
      <DemoBanner isLoggedIn={isLoggedIn} />
      <div className={classNames(layout.centered, layout.narrow)}>
        <SubPageHeader
          exit={{href: demoCalendarPath(viewMonth), label: '달력', icon: CalendarIcon}}
          monthNavigation={{
            previousHref: previous && demoStatsPath(previous),
            nextHref: next && demoStatsPath(next),
          }}
          title={formatStatsTitle(viewMonth)}
        />
        <main className={styles.body}>
          <DemoStatsSection
            month={viewMonth}
            monthly={monthly}
            overview={isSameMonth(today, viewMonth) ? overview : null}
            records={getDemoRecords(now)}
          />
        </main>
      </div>
      {/* 투어가 짚는 실패 카드 묶음이 없는 달에서는 띄우지 않는다 — 말풍선 없이 끝나도 「봤음」으로 찍혀 다시 안 뜬다 */}
      {monthly.failureTags.length > 0 && <DemoTourTrigger part="stats" />}
    </div>
  );
}

/* null: 404가 될 달(주소가 달이 아님·미래 달·첫 기록 전) */
function parseDemoStatsMonth(params: {year: string; month: string}, now: Date): DemoStatsMonth | null {
  const viewMonth = parseMonth(params);
  const today = getDemoToday(now);
  const overview = getDemoOverview(now);

  if (!viewMonth || isFutureMonth(today, viewMonth) || isBeforeFirstRecord(viewMonth, overview.firstRecordDate)) {
    return null;
  }

  return {viewMonth, today, overview};
}
