import {Redirect} from 'expo-router';
import {demoCalendarPath, parseDateParam} from '@plan-for-myself/shared';
import {useSuspenseQuery} from '@tanstack/react-query';
import {demoQueries} from '@/demo/queries';

export default function FetchedDemoEntry() {
  const {
    data: {today},
  } = useSuspenseQuery(demoQueries.thisMonth.options());

  return <Redirect href={demoCalendarPath(parseDateParam(today))} />;
}
