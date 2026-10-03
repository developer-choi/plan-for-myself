import {notFound} from 'next/navigation';
import HeaderMenu from '@/shared/components/HeaderMenu';
import PageShell from '@/shared/components/PageShell';
import {monthPath, parseMonth, shiftMonth} from '@/study-record/calendar-date';
import CalendarHeader from '@/study-record/components/CalendarHeader';

interface PageProps {
  params: Promise<{year: string; month: string}>;
}

export default async function Page({params}: PageProps) {
  const viewMonth = parseMonth(await params);

  if (!viewMonth) {
    notFound();
  }

  const logoutHref = `/api/next-auth/logout?redirect=${encodeURIComponent(monthPath(viewMonth))}`;

  return (
    <PageShell>
      <CalendarHeader
        menu={<HeaderMenu items={[{label: '로그아웃', href: logoutHref}]} />}
        nextHref={monthPath(shiftMonth(viewMonth, 1))}
        previousHref={monthPath(shiftMonth(viewMonth, -1))}
        title={`${viewMonth.year}년 ${viewMonth.month}월`}
      />
    </PageShell>
  );
}
