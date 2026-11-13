import {Redirect} from 'expo-router';
import {demoCalendarPath} from '@plan-for-myself/shared/demo';
import {parseDateParam} from '@plan-for-myself/shared/date';
import {useSuspenseQuery} from '@tanstack/react-query';
import {demoQueries} from '@/demo/queries';

export default function FetchedDemoEntry() {
  const {
    data: {today},
  } = useSuspenseQuery(demoQueries.thisMonth.options());

  return <Redirect href={demoCalendarPath(parseDateParam(today))} />;
}
