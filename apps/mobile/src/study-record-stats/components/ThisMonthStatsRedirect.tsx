import {Redirect} from 'expo-router';
import {parseDateParam} from '@plan-for-myself/shared/date';
import {statsPath} from '@plan-for-myself/shared/study-record';

interface ThisMonthStatsRedirectProps {
  today: string;
}

export default function ThisMonthStatsRedirect({today}: ThisMonthStatsRedirectProps) {
  const {year, month} = parseDateParam(today);

  return <Redirect href={statsPath({year, month})} />;
}
