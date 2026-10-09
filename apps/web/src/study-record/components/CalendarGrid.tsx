import type {StudyRecord} from '@plan-for-myself/shared';
import {minutesFormat} from '@plan-for-myself/shared';
import {Badge} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import {type CalendarMonth, getCalendarCells, WEEKDAY_LABELS} from '@/study-record/calendar-date';
import styles from './CalendarGrid.module.scss';

interface CalendarGridProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  handlers: {
    onFutureDateClick: () => void;
    /* 그날 기록이 없으면 record는 undefined */
    onRecordableDateClick: (date: string, record?: StudyRecord) => void;
  };
}

export default function CalendarGrid({month, today, records, handlers}: CalendarGridProps) {
  const recordByDate = new Map(records.map((record) => [record.date, record]));

  return (
    <div className={styles.calendar}>
      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className={classNames(typography.body3, styles.weekday)}>
            {label}
          </span>
        ))}
      </div>
      <div className={styles.grid}>
        {getCalendarCells(month).map(({date, day, inMonth}) => {
          if (!inMonth) {
            return (
              <time
                key={date}
                className={classNames(typography.body3, styles.dayNumber, styles.outsideDay)}
                dateTime={date}
              >
                {day}
              </time>
            );
          }

          const record = recordByDate.get(date);
          const isFuture = date > today;

          return (
            <button
              key={date}
              aria-current={date === today ? 'date' : undefined}
              className={styles.day}
              type="button"
              onClick={isFuture ? handlers.onFutureDateClick : () => handlers.onRecordableDateClick(date, record)}
            >
              <time className={classNames(typography.body3, typography.bold, styles.dayNumber)} dateTime={date}>
                {day}
              </time>
              {record && (
                <Badge className={styles.chip} color="neutral" size="small" variant="soft">
                  {minutesFormat(record.studiedMinutes.reduce((sum, minutes) => sum + minutes, 0))}
                </Badge>
              )}
              {record?.failTags.slice(0, MAX_FAIL_TAGS).map((tag) => (
                <Badge key={tag} className={styles.chip} color="danger" size="small" variant="soft">
                  <span className={styles.chipText}>{tag}</span>
                </Badge>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MAX_FAIL_TAGS = 2;
