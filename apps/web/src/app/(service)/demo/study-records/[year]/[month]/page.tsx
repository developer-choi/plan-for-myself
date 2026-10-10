import {notFound} from 'next/navigation';
import DemoCalendarMenu from '@/demo/components/DemoCalendarMenu';
import DemoCalendarSection from '@/demo/components/DemoCalendarSection';
import {DEMO_OVERVIEW, DEMO_RECORDS, DEMO_TODAY} from '@/demo/demo-examples';
import {demoCalendarPath} from '@/demo/demo-path';
import PageShell from '@/shared/components/PageShell';
import {parseMonth, shiftMonth} from '@/study-record/calendar-date';
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

  return (
    <PageShell>
      <CalendarHeader
        menu={<DemoCalendarMenu />}
        nextHref={demoCalendarPath(shiftMonth(viewMonth, 1))}
        previousHref={demoCalendarPath(shiftMonth(viewMonth, -1))}
        title={`${viewMonth.year}년 ${viewMonth.month}월`}
      />
      <main className={styles.body}>
        <DemoCalendarSection month={viewMonth} overview={DEMO_OVERVIEW} records={DEMO_RECORDS} today={DEMO_TODAY} />
      </main>
    </PageShell>
  );
}
