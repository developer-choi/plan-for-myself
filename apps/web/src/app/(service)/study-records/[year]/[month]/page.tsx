import {Suspense} from 'react';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import {getKoreanToday} from '@plan-for-myself/shared';
import LoginNudgeTrigger from '@/auth/components/LoginNudgeTrigger';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import PageShell from '@/shared/components/PageShell';
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
    <PageShell>
      <CalendarHeader
        menu={isGuest ? <GuestCalendarMenu /> : <CalendarMenu />}
        nextHref={monthPath(shiftMonth(viewMonth, 1))}
        previousHref={monthPath(shiftMonth(viewMonth, -1))}
        right={
          isGuest && (
            <>
              <Link
                className={classNames(typography.body2, typography.bold, styles.loginLink)}
                href="/login"
                id={LOGIN_LINK_ID}
              >
                로그인
              </Link>
              <LoginNudgeTrigger targetId={LOGIN_LINK_ID} />
            </>
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
    </PageShell>
  );
}

const LOGIN_LINK_ID = 'calendar-login-link';
