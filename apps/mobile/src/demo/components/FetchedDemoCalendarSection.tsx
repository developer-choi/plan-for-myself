import type {CalendarMonth} from '@plan-for-myself/shared';
import {useSuspenseQuery} from '@tanstack/react-query';
import DemoCalendarSection from '@/demo/components/DemoCalendarSection';
import {demoQueries} from '@/demo/queries';

interface FetchedDemoCalendarSectionProps {
  month: CalendarMonth;
}

export default function FetchedDemoCalendarSection({month}: FetchedDemoCalendarSectionProps) {
  const {
    data: {today, records, overview},
  } = useSuspenseQuery(demoQueries.thisMonth.options());

  return <DemoCalendarSection month={month} overview={overview} records={records} today={today} />;
}
