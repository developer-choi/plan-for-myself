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
  calendar: ReactNode;
  trend: TrendSectionProps;
  ref: Ref<HTMLDivElement>;
}

export default function TagDetailCard({tag, calendar, trend, ref}: TagDetailCardProps) {
  const hasTrend = trend.bars.length > 1;

  return (
    <div ref={ref} className={styles.anchor}>
      <Card id={TAG_DETAIL_CARD_ID} title={tag}>
        <section className={styles.section}>{calendar}</section>
        {hasTrend && <TrendSection {...trend} />}
      </Card>
    </div>
  );
}

export const TAG_DETAIL_CARD_ID = 'tag-detail-card';

function TrendSection({bars, inProgress}: TrendSectionProps) {
  return (
    <section className={styles.section}>
      <TrendBars bars={bars} inProgress={inProgress} />
    </section>
  );
}
