import {Suspense} from 'react';
import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import {formatMonthTitle, getKoreanToday, parseMonth, shiftMonth} from '@plan-for-myself/shared/date';
import {GOOGLE_CONNECT_PAGE_LABEL} from '@plan-for-myself/shared/label';
import {monthPath} from '@plan-for-myself/shared/study-record';
import FetchedLoginNudgeCard from '@/auth/components/FetchedLoginNudgeCard';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import layout from '@/shared/styles/layout.module.scss';
import CalendarHeader from '@/study-record/components/CalendarHeader';
import CalendarMenu from '@/study-record/components/CalendarMenu';
import GuestCalendarMenu from '@/study-record/components/GuestCalendarMenu';
import PrefetchedCalendar from '@/study-record/components/PrefetchedCalendar';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{year: string; month: string}>;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const viewMonth = parseMonth(await params);

  return viewMonth ? {title: formatMonthTitle(viewMonth)} : {};
}

export default async function Page({params}: PageProps) {
  const viewMonth = parseMonth(await params);

  if (!viewMonth) {
    notFound();
  }

  const isGuest = getLoginState(await auth()) === 'guest';
  const today = getKoreanToday();

  return (
    <div className={layout.shell}>
      <CalendarHeader
        menu={isGuest ? <GuestCalendarMenu /> : <CalendarMenu />}
        nextHref={monthPath(shiftMonth(viewMonth, 1))}
        previousHref={monthPath(shiftMonth(viewMonth, -1))}
        right={
          isGuest && (
            <Link className={classNames(typography.body2, typography.bold, styles.connectLink)} href="/login">
              {GOOGLE_CONNECT_PAGE_LABEL}
            </Link>
          )
        }
        title={formatMonthTitle(viewMonth)}
      />
      <main className={styles.body}>
        <HandledErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <PrefetchedCalendar month={viewMonth} today={today} />
          </Suspense>
        </HandledErrorBoundary>
      </main>
      {isGuest && <FetchedLoginNudgeCard today={today} />}
    </div>
  );
}
