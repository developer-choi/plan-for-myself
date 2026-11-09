import {type CalendarMonth, parseMonth} from '@plan-for-myself/shared/date';
import {
  demoCalendarPath,
  type DemoOverview,
  demoStatsPath,
  shouldShowDemoStatsTour,
} from '@plan-for-myself/shared/demo';
import {formatStatsTitle, getStatsMonthNavigation} from '@plan-for-myself/shared/study-record-stats';
import {isSameMonth} from '@plan-for-myself/shared/study-record';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import classNames from 'classnames';
import {CalendarIcon} from '@radix-ui/react-icons';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import DemoBanner from '@/demo/components/DemoBanner';
import DemoStatsSection from '@/demo/components/DemoStatsSection';
import DemoTourTrigger from '@/demo/components/DemoTourTrigger';
import {getDemoMonthly, getDemoOverview, getDemoRecords, getDemoToday} from '@/demo/demo-examples';
import {isDemoStatsMonth} from '@/demo/demo-response';
import SubPageHeader from '@/shared/components/SubPageHeader';
import layout from '@/shared/styles/layout.module.scss';
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
          exit={{href: demoCalendarPath(viewMonth), icon: CalendarIcon}}
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
      {shouldShowDemoStatsTour(monthly) && <DemoTourTrigger part="stats" />}
    </div>
  );
}

/* null: 404가 될 달(주소가 달이 아님·미래 달·첫 기록 전) */
function parseDemoStatsMonth(params: {year: string; month: string}, now: Date): DemoStatsMonth | null {
  const viewMonth = parseMonth(params);
  const today = getDemoToday(now);
  const overview = getDemoOverview(now);

  if (!viewMonth || !isDemoStatsMonth(viewMonth, today, overview.firstRecordDate)) {
    return null;
  }

  return {viewMonth, today, overview};
}
