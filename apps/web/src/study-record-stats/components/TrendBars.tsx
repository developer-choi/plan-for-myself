import {FAILURE_TAG_TREND_MONTH_LIMIT} from '@plan-for-myself/shared/study-record';
import {STATS_TEXT, type TrendBar} from '@plan-for-myself/shared/study-record-stats';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
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
        const startStyle = index === 0 ? {gridColumnStart: FAILURE_TAG_TREND_MONTH_LIMIT - bars.length + 1} : undefined;

        return (
          <li
            key={bar.label}
            className={styles.column}
            data-in-progress={isInProgressBar || undefined}
            data-status={bar.status}
            style={startStyle}
          >
            <span className={classNames(typography.body3, styles.value)}>{bar.value || ''}</span>
            <span className={styles.bar} style={{'--trend-bar-ratio': bar.value / max}} />
            <span className={classNames(typography.body3, styles.label)}>
              {bar.label}
              {isInProgressBar && <span className={styles.inProgress}>{STATS_TEXT.inProgressLabel}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
