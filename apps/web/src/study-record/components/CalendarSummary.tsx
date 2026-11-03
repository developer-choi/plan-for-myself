import {Button} from '@developer-choi/design-system';
import {type CalendarSummaryContent, STATS_LABEL} from '@plan-for-myself/shared';
import {BarChartIcon} from '@radix-ui/react-icons';
import Link from 'next/link';
import styles from './CalendarSummary.module.scss';

export default function CalendarSummary({statsHref}: CalendarSummaryContent) {
  return (
    <div className={styles.summary}>
      {statsHref !== undefined && (
        <Button asChild color="secondary" size="small" variant="outlined">
          <Link href={statsHref} id={CALENDAR_STATS_LINK_ID}>
            <BarChartIcon />
            {STATS_LABEL}
          </Link>
        </Button>
      )}
    </div>
  );
}

export const CALENDAR_STATS_LINK_ID = 'calendar-stats-link';
