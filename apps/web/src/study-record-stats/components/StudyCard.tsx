import {minutesFormat, type StudyRecordMonthly} from '@plan-for-myself/shared';
import Card from '@/shared/components/Card';
import StatList, {StatListItem} from '@/study-record-stats/components/StatList';
import {formatMinutesDiff, formatMonthLabel, minutesToHours} from '@/study-record-stats/format';

interface StudyCardProps {
  monthly: StudyRecordMonthly;
}

interface AverageItemProps {
  label: string;
  minutes: number;
  /* 지난달 같은 날 종류 기록이 없으면 null — 보조 글만 숨긴다 */
  previousMinutes: number | null;
}

export default function StudyCard({monthly}: StudyCardProps) {
  const {totalMinutes, weekdayAvg, holidayAvg, prevWeekdayAvg, prevHolidayAvg} = monthly.study;

  return (
    <Card title="공부">
      <StatList>
        <StatListItem
          label={`${formatMonthLabel(monthly.month)} 총 공부`}
          value={`${minutesToHours(totalMinutes)}시간`}
        />
        {weekdayAvg !== null && <AverageItem label="평일 평균" minutes={weekdayAvg} previousMinutes={prevWeekdayAvg} />}
        {holidayAvg !== null && <AverageItem label="휴일 평균" minutes={holidayAvg} previousMinutes={prevHolidayAvg} />}
      </StatList>
    </Card>
  );
}

function AverageItem({label, minutes, previousMinutes}: AverageItemProps) {
  return (
    <StatListItem
      label={label}
      note={previousMinutes === null ? undefined : `지난달 ${formatMinutesDiff(minutes - previousMinutes)}`}
      value={minutesFormat(minutes)}
    />
  );
}
