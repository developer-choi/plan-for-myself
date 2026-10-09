import type {FailureTagTrend, StudyRecord} from '@plan-for-myself/shared';
import {type CalendarMonth, getCalendarCells} from '@/study-record/calendar-date';
import {formatMonthLabel} from '@/study-record-stats/format';

export interface TrendBar {
  label: string;
  value: number;
  status: FailureTagTrend['status'];
}

export type TagCalendarDayState = 'hit' | 'recorded' | 'missing' | 'inactive';

export interface TagCalendarDay {
  date: string;
  day: number;
  state: TagCalendarDayState;
}

export interface TagCalendarData {
  leadingBlanks: number;
  days: TagCalendarDay[];
}

interface TagCalendarParams {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  tag: string;
}

interface DayStateParams extends Pick<TagCalendarParams, 'today' | 'tag'> {
  /* 그날 기록이 없으면 undefined */
  record: StudyRecord | undefined;
  date: string;
}

export function toTrendBars(trend: FailureTagTrend[]): TrendBar[] {
  return trend.map(({month, count, status}) => ({
    label: formatMonthLabel(month),
    value: count,
    status,
  }));
}

export function getTagCalendar({month, today, records, tag}: TagCalendarParams): TagCalendarData {
  const cells = getCalendarCells(month);
  const recordByDate = new Map(records.map((record) => [record.date, record]));

  return {
    leadingBlanks: cells.findIndex(({inMonth}) => inMonth),
    days: cells
      .filter(({inMonth}) => inMonth)
      .map(({date, day}) => ({date, day, state: getDayState({record: recordByDate.get(date), date, today, tag})})),
  };
}

function getDayState({record, date, today, tag}: DayStateParams): TagCalendarDayState {
  if (record) {
    return record.failTags.includes(tag) ? 'hit' : 'recorded';
  }
  return date >= today ? 'inactive' : 'missing';
}
