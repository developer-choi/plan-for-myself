import {
  type CalendarMonth,
  formatStatsTitle,
  getStatsMonthNavigation,
  monthPath,
  statsPath,
} from '@plan-for-myself/shared';
import {Lucide} from '@react-native-vector-icons/lucide';
import {ICON_COLOR} from '@/shared/components/IconButton';
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
      exit={{href: monthPath(month), icon: EXIT_ICON}}
      monthNavigation={{
        previousHref: previous && statsPath(previous),
        nextHref: next && statsPath(next),
      }}
      title={formatStatsTitle(month)}
    />
  );
}

const EXIT_ICON = <Lucide color={ICON_COLOR} name="calendar" size={24} />;
