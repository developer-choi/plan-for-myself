import {
  type CalendarMonth,
  demoCalendarPath,
  demoStatsPath,
  formatStatsTitle,
  getStatsMonthNavigation,
} from '@plan-for-myself/shared';
import {Lucide} from '@react-native-vector-icons/lucide';
import {ICON_COLOR} from '@/shared/components/IconButton';
import SubPageHeader from '@/shared/components/SubPageHeader';

interface DemoStatsHeaderProps {
  month: CalendarMonth;
  today: string;
  firstRecordDate: string;
}

export default function DemoStatsHeader({month, today, firstRecordDate}: DemoStatsHeaderProps) {
  const {previous, next} = getStatsMonthNavigation({today, month, firstRecordDate});

  return (
    <SubPageHeader
      exit={{href: demoCalendarPath(month), icon: EXIT_ICON}}
      monthNavigation={{
        previousHref: previous && demoStatsPath(previous),
        nextHref: next && demoStatsPath(next),
      }}
      title={formatStatsTitle(month)}
    />
  );
}

const EXIT_ICON = <Lucide color={ICON_COLOR} name="calendar" size={24} />;
