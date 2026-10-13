import type {StudyRecordMonthly} from '@plan-for-myself/shared';
import Card from '@/shared/components/Card';
import StatList, {StatListItem, StatValue} from '@/study-record-stats/components/StatList';
import {formatDuration, formatMinutesDiff, formatMonthLabel} from '@/study-record-stats/format';

interface StudyCardProps {
  monthly: StudyRecordMonthly;
  /* 지난 달 통계면 null — 지금까지 공부한 시간은 지금 기준 값이라 이번 달에서만 보인다 */
  totalStudiedMinutes: number | null;
}

interface AverageItemProps {
  label: string;
  minutes: number;
  /* 지난달 같은 날 종류 기록이 없으면 null — 보조 글만 숨긴다 */
  previousMinutes: number | null;
}

export default function StudyCard({monthly, totalStudiedMinutes}: StudyCardProps) {
  const {totalMinutes, weekdayAvg, holidayAvg, prevWeekdayAvg, prevHolidayAvg} = monthly.study;

  return (
    <Card title="공부">
      <StatList>
        <StatListItem
          label={`${formatMonthLabel(monthly.month)} 총 공부`}
          value={<StatValue>{formatDuration(totalMinutes)}</StatValue>}
        />
        {weekdayAvg !== null && <AverageItem label="평일 평균" minutes={weekdayAvg} previousMinutes={prevWeekdayAvg} />}
        {holidayAvg !== null && <AverageItem label="휴일 평균" minutes={holidayAvg} previousMinutes={prevHolidayAvg} />}
        {totalStudiedMinutes !== null && (
          <StatListItem label="누적 총 공부" value={<StatValue>{formatDuration(totalStudiedMinutes)}</StatValue>} />
        )}
      </StatList>
    </Card>
  );
}

function AverageItem({label, minutes, previousMinutes}: AverageItemProps) {
  const diff = previousMinutes === null ? 0 : minutes - previousMinutes;

  return (
    <StatListItem
      label={label}
      note={diff === 0 ? undefined : `지난달 ${formatMinutesDiff(diff)}`}
      value={<StatValue>{formatDuration(minutes)}</StatValue>}
    />
  );
}
