import {Suspense} from 'react';
import {notFound} from 'next/navigation';
import {getKoreanToday} from '@plan-for-myself/shared';
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

  const loginState = getLoginState(await auth());
  const today = getKoreanToday();

  return (
    <PageShell>
      <CalendarHeader
        menu={loginState === 'guest' ? <GuestCalendarMenu /> : <CalendarMenu viewPath={monthPath(viewMonth)} />}
        nextHref={monthPath(shiftMonth(viewMonth, 1))}
        previousHref={monthPath(shiftMonth(viewMonth, -1))}
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
