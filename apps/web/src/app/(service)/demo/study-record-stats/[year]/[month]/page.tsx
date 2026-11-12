import {type CalendarMonth, parseMonth, toMonthParam} from '@plan-for-myself/shared/date';
import {
  demoCalendarPath,
  demoStatsPath,
  type GetDemoApiResponse,
  shouldShowDemoStatsTour,
} from '@plan-for-myself/shared/demo';
import {formatStatsTitle, getStatsMonthNavigation} from '@plan-for-myself/shared/study-record-stats';
import {isSameMonth, type StudyRecordMonthly} from '@plan-for-myself/shared/study-record';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import classNames from 'classnames';
import {CalendarIcon} from '@radix-ui/react-icons';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import DemoBanner from '@/demo/components/DemoBanner';
import DemoStatsSection from '@/demo/components/DemoStatsSection';
import DemoTourTrigger from '@/demo/components/DemoTourTrigger';
import {serverDemoApi} from '@/demo/server-api';
import SubPageHeader from '@/shared/components/SubPageHeader';
import layout from '@/shared/styles/layout.module.scss';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{year: string; month: string}>;
}

type DemoStats = GetDemoApiResponse & {viewMonth: CalendarMonth; monthly: StudyRecordMonthly};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const demoStats = await readDemoStats(await params);

  return demoStats ? {title: formatStatsTitle(demoStats.viewMonth)} : {};
}

export default async function Page({params}: PageProps) {
  const [demoStats, session] = await Promise.all([readDemoStats(await params), auth()]);

  if (!demoStats) {
    notFound();
  }

  const {viewMonth, today, records, overview, monthly} = demoStats;

  const isLoggedIn = getLoginState(session) !== 'logged-out';
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
            records={records}
          />
        </main>
      </div>
      {shouldShowDemoStatsTour(monthly) && <DemoTourTrigger part="stats" />}
    </div>
  );
}

/** null: 404가 될 달(주소가 달이 아님·미래 달·첫 기록 전) */
async function readDemoStats(params: {year: string; month: string}): Promise<DemoStats | null> {
  const viewMonth = parseMonth(params);

  if (!viewMonth) {
    return null;
  }

  const response = await serverDemoApi.getDemoApi({month: toMonthParam(viewMonth)});
  const {monthly} = response;

  return monthly === null ? null : {...response, viewMonth, monthly};
}
