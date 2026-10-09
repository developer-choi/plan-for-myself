import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import {WEEKDAY_LABELS} from '@/study-record/calendar-date';
import {type TagCalendarData} from '@/study-record-stats/tag-detail';
import styles from './TagCalendar.module.scss';

interface TagCalendarProps {
  calendar: TagCalendarData;
}

export default function TagCalendar({calendar}: TagCalendarProps) {
  return (
    <div className={styles.calendar}>
      <ol className={styles.grid}>
        {WEEKDAY_LABELS.map((label) => (
          <li key={label} className={classNames(typography.body3, styles.weekday)}>
            {label}
          </li>
        ))}
      </ol>
      <ol className={styles.grid}>
        {calendar.days.map(({date, day, state}, index) => (
          <li
            key={date}
            className={classNames(typography.body3, styles.day)}
            data-state={state}
            style={{gridColumnStart: index === 0 ? calendar.leadingBlanks + 1 : undefined}}
          >
            <time dateTime={date}>{day}</time>
          </li>
        ))}
      </ol>
    </div>
  );
}
