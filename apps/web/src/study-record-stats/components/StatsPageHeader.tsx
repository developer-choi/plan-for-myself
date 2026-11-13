import type {CalendarMonth} from '@plan-for-myself/shared/date';
import {formatStatsTitle, getStatsMonthNavigation} from '@plan-for-myself/shared/study-record-stats';
import {monthPath, statsPath} from '@plan-for-myself/shared/study-record';
import {CalendarIcon} from '@radix-ui/react-icons';
import SubPageHeader from '@/shared/components/SubPageHeader';

interface StatsPageHeaderProps {
  month: CalendarMonth;
  today: string;
  /* 기록이 하나도 없거나 아직 받지 못했으면 null — 달 이동을 숨긴다 */
  firstRecordDate: string | null;
}

export default function StatsPageHeader({month, today, firstRecordDate}: StatsPageHeaderProps) {
  const {previous, next} = getStatsMonthNavigation({today, month, firstRecordDate});

  return (
    <SubPageHeader
      exit={{href: monthPath(month), icon: CalendarIcon}}
      monthNavigation={{
        previousHref: previous && statsPath(previous),
        nextHref: next && statsPath(next),
      }}
      title={formatStatsTitle(month)}
    />
  );
}
