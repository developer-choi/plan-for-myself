import {Suspense} from 'react';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import {getKoreanToday} from '@plan-for-myself/shared';
import LoginNudgeCard from '@/auth/components/LoginNudgeCard';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import {GOOGLE_CONNECT_PAGE_LABEL} from '@/shared/labels';
import layout from '@/shared/styles/layout.module.scss';
import {monthPath, parseMonth, shiftMonth} from '@/study-record/calendar-date';
import CalendarHeader from '@/study-record/components/CalendarHeader';
import CalendarMenu from '@/study-record/components/CalendarMenu';
import GuestCalendarMenu from '@/study-record/components/GuestCalendarMenu';
import PrefetchedCalendar from '@/study-record/components/PrefetchedCalendar';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{year: string; month: string}>;
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
        title={`${viewMonth.year}년 ${viewMonth.month}월`}
      />
      <main className={styles.body}>
        <HandledErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <PrefetchedCalendar month={viewMonth} today={today} />
          </Suspense>
        </HandledErrorBoundary>
      </main>
      {isGuest && <LoginNudgeCard today={today} />}
    </div>
  );
}
