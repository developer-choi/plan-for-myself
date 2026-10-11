import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import {type ReactNode, type Ref} from 'react';
import Card from '@/shared/components/Card';
import TrendBars from '@/study-record-stats/components/TrendBars';
import {type TrendBar} from '@/study-record-stats/tag-detail';
import styles from './TagDetailCard.module.scss';

interface TrendSectionProps {
  bars: TrendBar[];
  inProgress: boolean;
}

interface TagDetailCardProps {
  tag: string;
  month: number;
  calendar: ReactNode;
  trend: TrendSectionProps;
  ref: Ref<HTMLDivElement>;
}

export default function TagDetailCard({tag, month, calendar, trend, ref}: TagDetailCardProps) {
  const hasTrend = trend.bars.length > 1;

  return (
    <div ref={ref} className={styles.anchor}>
      <Card title={tag}>
        <section className={styles.section} id={TAG_CALENDAR_SECTION_ID}>
          <h3 className={classNames(typography.body3, styles.subTitle)}>{month}월 달력</h3>
          {calendar}
        </section>
        {hasTrend && <TrendSection {...trend} />}
      </Card>
    </div>
  );
}

export const TAG_CALENDAR_SECTION_ID = 'tag-detail-calendar-section';

function TrendSection({bars, inProgress}: TrendSectionProps) {
  return (
    <section className={styles.section}>
      <h3 className={classNames(typography.body3, styles.subTitle)}>월별 추이</h3>
      <TrendBars bars={bars} inProgress={inProgress} />
    </section>
  );
}
