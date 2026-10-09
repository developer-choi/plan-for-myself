import {FAILURE_TAG_TREND_MONTH_LIMIT} from '@plan-for-myself/shared';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import {type TrendBar} from '@/study-record-stats/tag-detail';
import styles from './TrendBars.module.scss';

interface TrendBarsProps {
  bars: TrendBar[];
  /* 마지막 막대가 아직 안 끝난 이번 달일 때만 켠다 */
  inProgress?: boolean;
}

export default function TrendBars({bars, inProgress = false}: TrendBarsProps) {
  const max = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <ol className={styles.bars} style={{'--trend-columns': FAILURE_TAG_TREND_MONTH_LIMIT}}>
      {bars.map((bar, index) => {
        const isInProgressBar = inProgress && index === bars.length - 1;

        return (
          <li
            key={bar.label}
            className={styles.column}
            data-in-progress={isInProgressBar || undefined}
            data-status={bar.status}
          >
            <span className={classNames(typography.body3, styles.value)}>{bar.value || ''}</span>
            <span className={styles.bar} style={{'--trend-bar-ratio': bar.value / max}} />
            <span className={classNames(typography.body3, styles.label)}>{bar.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
