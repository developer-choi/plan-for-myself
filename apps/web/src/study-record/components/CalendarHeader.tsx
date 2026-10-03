import {type ReactNode} from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import {ChevronLeftIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import {IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './CalendarHeader.module.scss';

interface CalendarHeaderProps {
  title: string;
  previousHref: string;
  nextHref: string;
  menu: ReactNode;
}

export default function CalendarHeader({title, previousHref, nextHref, menu}: CalendarHeaderProps) {
  return (
    <header className={styles.calendarHeader}>
      <div className={styles.menuSlot}>{menu}</div>
      <div className={styles.monthNavigation}>
        <IconButton asChild aria-label="이전 달" icon={<ChevronLeftIcon />}>
          <Link href={previousHref} />
        </IconButton>
        <h1 className={classNames(typography.h3, typography.bold, styles.calendarTitle)}>{title}</h1>
        <IconButton asChild aria-label="다음 달" icon={<ChevronRightIcon />}>
          <Link href={nextHref} />
        </IconButton>
      </div>
    </header>
  );
}
