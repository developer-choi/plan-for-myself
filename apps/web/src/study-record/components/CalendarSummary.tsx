import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import styles from './CalendarSummary.module.scss';

interface CalendarSummaryProps {
  streak: number;
}

export default function CalendarSummary({streak}: CalendarSummaryProps) {
  return (
    <p className={classNames(typography.body3, styles.summary)}>
      연속 기록 <span className={styles.streakCount}>{streak}</span>일
    </p>
  );
}
