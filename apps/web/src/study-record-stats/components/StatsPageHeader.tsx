import {CalendarIcon} from '@radix-ui/react-icons';
import SubPageHeader from '@/shared/components/SubPageHeader';
import {type CalendarMonth, monthPath, statsPath} from '@/study-record/calendar-date';
import {formatStatsTitle} from '@/study-record-stats/format';
import {getStatsMonthNavigation} from '@/study-record-stats/month-navigation';

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
      exit={{href: monthPath(month), label: '달력', icon: CalendarIcon}}
      monthNavigation={{
        previousHref: previous && statsPath(previous),
        nextHref: next && statsPath(next),
      }}
      title={formatStatsTitle(month)}
    />
  );
}
