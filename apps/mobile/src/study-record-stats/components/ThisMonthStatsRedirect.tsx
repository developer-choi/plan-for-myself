import {Redirect} from 'expo-router';
import {parseDateParam, statsPath} from '@plan-for-myself/shared';

interface ThisMonthStatsRedirectProps {
  today: string;
}

export default function ThisMonthStatsRedirect({today}: ThisMonthStatsRedirectProps) {
  const {year, month} = parseDateParam(today);

  return <Redirect href={statsPath({year, month})} />;
}
