import {type CalendarMonth, getCalendarCells} from '../date/calendar-month';
import type {FailureTagTrend, StudyRecord} from '../study-record/type';
import {formatMonthLabel} from './format';

export interface TrendBar {
  label: string;
  value: number;
  status: FailureTagTrend['status'];
}

type TagCalendarDayState = 'hit' | 'none';

interface TagCalendarDay {
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
  records: StudyRecord[];
  tag: string;
}

export function toTrendBars(trend: FailureTagTrend[]): TrendBar[] {
  return trend.map(({month, count, status}) => ({
    label: formatMonthLabel(month),
    value: count,
    status,
  }));
}

export function getTagCalendar({month, records, tag}: TagCalendarParams): TagCalendarData {
  const cells = getCalendarCells(month);
  const recordByDate = new Map(records.map((record) => [record.date, record]));

  return {
    leadingBlanks: cells.findIndex(({inMonth}) => inMonth),
    days: cells
      .filter(({inMonth}) => inMonth)
      .map(({date, day}) => ({date, day, state: getDayState(recordByDate.get(date), tag)})),
  };
}

function getDayState(record: StudyRecord | undefined, tag: string): TagCalendarDayState {
  return record?.failTags.includes(tag) ? 'hit' : 'none';
}
