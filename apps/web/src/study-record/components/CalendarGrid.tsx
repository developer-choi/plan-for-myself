import {type CalendarMonth, WEEKDAY_LABELS} from '@plan-for-myself/shared/date';
import {type StudyRecord, getCalendarDayCells} from '@plan-for-myself/shared/study-record';
import {Badge} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
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
        {getCalendarDayCells(month, today, records).map(
          ({date, day, inMonth, record, isFuture, isToday, studiedTime, failTags}) => {
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

            return (
              <button
                key={date}
                className={styles.day}
                data-today={isToday || undefined}
                type="button"
                onClick={isFuture ? handlers.onFutureDateClick : () => handlers.onRecordableDateClick(date, record)}
              >
                <time className={classNames(typography.body3, typography.bold, styles.dayNumber)} dateTime={date}>
                  {day}
                </time>
                {studiedTime && (
                  <Badge className={styles.chip} color="neutral" size="small" variant="soft">
                    {studiedTime}
                  </Badge>
                )}
                {failTags.map((tag) => (
                  <Badge key={tag} className={styles.chip} color="danger" size="small" variant="solid">
                    <span className={styles.chipText}>{tag}</span>
                  </Badge>
                ))}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}
