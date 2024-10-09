'use client';

import CustomLink from '@/components/element/link/CustomLink';
import React, {useMemo} from 'react';
import {getCalendarNavigation} from '@/utils/extend/date/calendar';
import styles from './index.module.scss';

export interface StudiedTimeNavigationProps {
  year: number;
  month: number;
}

export default function StudiedTimeNavigation({year, month}: StudiedTimeNavigationProps) {
  const {previousCalendar, nextCalendar} = useMemo(() => {
    return getCalendarNavigation(year, month);
  }, [month, year])

  return (
    <div className={styles.navigator}>
      <CustomLink href={`/studied-time/${previousCalendar.year}/${previousCalendar.month}`}>Previous</CustomLink>
      <CustomLink href={`/studied-time/${nextCalendar.year}/${nextCalendar.month}`}>Next</CustomLink>
    </div>
  );
}
