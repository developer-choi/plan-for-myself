import {type CalendarCell, type CalendarMonth, getCalendarCells} from '../date/calendar-month';
import {type CalendarCellBadges, getCalendarCellBadges} from './calendar-cell-badges';
import type {StudyRecord} from './type';

interface CalendarDayCell extends CalendarCell, CalendarCellBadges {
  /* 그날 기록이 없으면 undefined */
  record: StudyRecord | undefined;
  isFuture: boolean;
  isToday: boolean;
}

export function getCalendarDayCells(month: CalendarMonth, today: string, records: StudyRecord[]): CalendarDayCell[] {
  const recordByDate = new Map(records.map((record) => [record.date, record]));

  return getCalendarCells(month).map((cell) => {
    const record = recordByDate.get(cell.date);

    return {
      ...cell,
      ...getCalendarCellBadges(record),
      record,
      isFuture: cell.date > today,
      isToday: cell.date === today,
    };
  });
}
