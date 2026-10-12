import {notFound} from 'next/navigation';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import DemoCalendarMenu from '@/demo/components/DemoCalendarMenu';
import DemoCalendarSection from '@/demo/components/DemoCalendarSection';
import DemoTourTrigger from '@/demo/components/DemoTourTrigger';
import {getDemoMonth, getDemoOverview, getDemoRecords, getDemoToday} from '@/demo/demo-examples';
import {demoCalendarPath} from '@/demo/demo-path';
import layout from '@/shared/styles/layout.module.scss';
import {isSameMonth, parseMonth, shiftMonth} from '@/study-record/calendar-date';
import CalendarHeader from '@/study-record/components/CalendarHeader';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{year: string; month: string}>;
}

export default async function Page({params}: PageProps) {
  const viewMonth = parseMonth(await params);

  if (!viewMonth) {
    notFound();
  }

  const isLoggedIn = getLoginState(await auth()) !== 'logged-out';
  const now = new Date();
  const demoMonth = getDemoMonth(now);
  const records = getDemoRecords(now);
  const firstRecordDateOfDemoMonth = records.filter((record) => isSameMonth(record.date, demoMonth))[0].date;

  return (
    <div className={layout.shell}>
      <CalendarHeader
        menu={<DemoCalendarMenu isLoggedIn={isLoggedIn} />}
        nextHref={demoCalendarPath(shiftMonth(viewMonth, 1))}
        previousHref={demoCalendarPath(shiftMonth(viewMonth, -1))}
        title={`${viewMonth.year}년 ${viewMonth.month}월`}
      />
      <main className={styles.body}>
        <DemoCalendarSection
          month={viewMonth}
          overview={getDemoOverview(now)}
          records={records}
          today={getDemoToday(now)}
        />
      </main>
      <DemoTourTrigger demoMonth={demoMonth} firstRecordDate={firstRecordDateOfDemoMonth} part="calendar" />
    </div>
  );
}
