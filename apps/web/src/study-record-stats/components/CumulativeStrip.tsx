import type {StudyRecordMonthly, StudyRecordOverview} from '@plan-for-myself/shared';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Card from '@/shared/components/Card';
import {formatHours} from '@/study-record-stats/format';
import styles from './CumulativeStrip.module.scss';

interface CumulativeStripProps {
  totals: StudyRecordOverview['totals'];
  monthly: StudyRecordMonthly;
}

interface CellProps {
  /* 말풍선이 가리키지 않는 칸이면 비운다 */
  id?: string;
  label: string;
  unit: string;
  value: string;
  /* 증가값 보조 줄이 없는 칸이면 비운다 */
  added?: string;
}

export default function CumulativeStrip({totals, monthly}: CumulativeStripProps) {
  return (
    <dl className={styles.strip}>
      <Cell
        added={String(monthly.recordedDays.count)}
        label="누적 기록"
        unit="일"
        value={String(totals.recordedDays)}
      />
      <Cell id={IMPROVED_FAILURES_CELL_ID} label="개선된 실패" unit="개" value={String(totals.improvedFailures)} />
      <Cell
        added={formatHours(monthly.study.totalMinutes)}
        label="누적 공부"
        unit="시간"
        value={formatHours(totals.studiedMinutes)}
      />
    </dl>
  );
}

export const IMPROVED_FAILURES_CELL_ID = 'improved-failures-cell';

function Cell({id, label, unit, value, added}: CellProps) {
  return (
    <Card id={id}>
      <dt className={classNames(typography.body3, styles.label)}>{label}</dt>
      <dd className={classNames(typography.h3, typography.bold, styles.value)}>
        {value}
        <span className={classNames(typography.body3, styles.unit)}>{unit}</span>
      </dd>
      {added !== undefined && <dd className={classNames(typography.body3, styles.added)}>+{added}</dd>}
    </Card>
  );
}
