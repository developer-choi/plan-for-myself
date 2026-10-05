import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {BarChartIcon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import Link from 'next/link';
import type {CalendarSummaryContent} from '@/study-record/calendar-summary';
import styles from './CalendarSummary.module.scss';

export default function CalendarSummary({statsHref, streak}: CalendarSummaryContent) {
  return (
    <div className={styles.summary}>
      {statsHref !== undefined && (
        <Button asChild color="surface" size="small">
          <Link href={statsHref}>
            <BarChartIcon />
            통계
          </Link>
        </Button>
      )}
      {streak !== undefined && (
        <p className={classNames(typography.body3, styles.streak)}>
          연속 기록 <span className={styles.streakCount}>{streak}</span>일
        </p>
      )}
    </div>
  );
}
