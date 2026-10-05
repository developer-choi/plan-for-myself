import type {DateType, StudyRecord, StudyRecordMonthly} from '@plan-for-myself/shared';
import {addMonths, getDayOfMonth, getDaysInMonth, toMonth} from './date';
import {sumMinutes} from './minutes';

export function calculateMonthly(records: StudyRecord[], month: string, date: string): StudyRecordMonthly {
  const recordsUntilDate = records.filter((record) => record.date <= date);
  const previousMonth = addMonths(month, -1);
  const monthRecords = filterMonth(recordsUntilDate, month);
  const previousRecords = filterMonth(recordsUntilDate, previousMonth);
  const firstRecordDate = recordsUntilDate
    .map((record) => record.date)
    .sort()
    .at(0);
  const isPreviousMonthUncounted = firstRecordDate === undefined || previousMonth < toMonth(firstRecordDate);
  const hasDateRecord = recordsUntilDate.some((record) => record.date === date);
  const countDays = (target: string, targetRecords: StudyRecord[]) => ({
    count: targetRecords.length,
    total: countTotalDays(target, date, hasDateRecord),
  });

  return {
    month,
    inProgress: month === toMonth(date),
    recordedDays: countDays(month, monthRecords),
    previousRecordedDays: isPreviousMonthUncounted ? null : countDays(previousMonth, previousRecords),
    study: {
      totalMinutes: monthRecords.reduce((sum, record) => sum + sumMinutes(record), 0),
      weekdayAvg: averageMinutes(monthRecords, 'weekday'),
      holidayAvg: averageMinutes(monthRecords, 'holiday'),
      prevWeekdayAvg: averageMinutes(previousRecords, 'weekday'),
      prevHolidayAvg: averageMinutes(previousRecords, 'holiday'),
    },
  };
}

function filterMonth(records: StudyRecord[], month: string) {
  return records.filter((record) => toMonth(record.date) === month);
}

function countTotalDays(month: string, date: string, hasDateRecord: boolean) {
  if (month !== toMonth(date)) {
    return getDaysInMonth(month);
  }
  const untilYesterday = getDayOfMonth(date) - 1;
  return hasDateRecord ? untilYesterday + 1 : untilYesterday;
}

function averageMinutes(records: StudyRecord[], dateType: DateType) {
  const matched = records.filter((record) => record.dateType === dateType);
  if (matched.length === 0) {
    return null;
  }
  return Math.round(matched.reduce((sum, record) => sum + sumMinutes(record), 0) / matched.length);
}
