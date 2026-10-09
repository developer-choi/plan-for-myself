import type {DateType, FailureTag, FailureTagStatus, StudyRecord, StudyRecordMonthly} from '@plan-for-myself/shared';
import {addMonths, getDayOfMonth, getDaysInMonth, toMonth} from './date';
import {sumMinutes} from './minutes';
import {countTagsByMonth, getTagCount, isReduced, type TagCountByMonth} from './tag-count';
import {listTrend} from './trend';

export function calculateMonthly(records: StudyRecord[], month: string, date: string): StudyRecordMonthly {
  const recordsUntilDate = records.filter((record) => record.date <= date);
  const previousMonth = addMonths(month, -1);
  const monthRecords = filterMonth(recordsUntilDate, month);
  const previousRecords = filterMonth(recordsUntilDate, previousMonth);
  const firstRecordDate = recordsUntilDate
    .map((record) => record.date)
    .sort()
    .at(0);
  const hasDateRecord = recordsUntilDate.some((record) => record.date === date);
  const countDays = (target: string, targetRecords: StudyRecord[]) => ({
    count: targetRecords.length,
    total: countTotalDays({month: target, date, hasDateRecord, firstRecordDate}),
  });

  return {
    month,
    inProgress: month === toMonth(date),
    recordedDays: countDays(month, monthRecords),
    previousRecordedDays: previousRecords.length === 0 ? null : countDays(previousMonth, previousRecords),
    study: {
      totalMinutes: monthRecords.reduce((sum, record) => sum + sumMinutes(record), 0),
      weekdayAvg: averageMinutes(monthRecords, 'weekday'),
      holidayAvg: averageMinutes(monthRecords, 'holiday'),
      prevWeekdayAvg: averageMinutes(previousRecords, 'weekday'),
      prevHolidayAvg: averageMinutes(previousRecords, 'holiday'),
    },
    failureTags: listFailureTags(countTagsByMonth(recordsUntilDate), month),
  };
}

const STATUS_ORDER: Record<FailureTagStatus, number> = {repeated: 0, appeared: 1, reduced: 2};

function filterMonth(records: StudyRecord[], month: string) {
  return records.filter((record) => toMonth(record.date) === month);
}

interface CountTotalDaysParams {
  month: string;
  date: string;
  hasDateRecord: boolean;
  /* 요청한 날짜까지 기록이 하나도 없으면 undefined */
  firstRecordDate: string | undefined;
}

function countTotalDays({month, date, hasDateRecord, firstRecordDate}: CountTotalDaysParams) {
  const isFirstRecordMonth = firstRecordDate !== undefined && toMonth(firstRecordDate) === month;
  const startDay = isFirstRecordMonth ? getDayOfMonth(firstRecordDate) : 1;
  return getLastCountedDay(month, date, hasDateRecord) - startDay + 1;
}

function getLastCountedDay(month: string, date: string, hasDateRecord: boolean) {
  if (month !== toMonth(date)) {
    return getDaysInMonth(month);
  }
  const yesterday = getDayOfMonth(date) - 1;
  return hasDateRecord ? yesterday + 1 : yesterday;
}

function averageMinutes(records: StudyRecord[], dateType: DateType) {
  const matched = records.filter((record) => record.dateType === dateType);
  if (matched.length === 0) {
    return null;
  }
  return Math.round(matched.reduce((sum, record) => sum + sumMinutes(record), 0) / matched.length);
}

/* 그 달 0번이 된 태그도 「줄어듦」으로 보여야 해서 전달 태그까지 넣는다 */
function listFailureTags(counts: TagCountByMonth, month: string): FailureTag[] {
  const previousMonth = addMonths(month, -1);
  const tags = new Set([...(counts.get(month)?.keys() ?? []), ...(counts.get(previousMonth)?.keys() ?? [])]);

  return [...tags]
    .map((tag) => {
      const count = getTagCount(counts, month, tag);
      const previousCount = getTagCount(counts, previousMonth, tag);
      return {
        tag,
        count,
        previousCount,
        status: judgeStatus(count, previousCount),
        trend: listTrend(counts, month, tag),
      };
    })
    .sort(compareFailureTags);
}

function judgeStatus(count: number, previousCount: number): FailureTagStatus {
  if (previousCount === 0) {
    return 'appeared';
  }
  return isReduced(count, previousCount) ? 'reduced' : 'repeated';
}

function compareFailureTags(left: FailureTag, right: FailureTag) {
  return STATUS_ORDER[left.status] - STATUS_ORDER[right.status] || compareWithinStatus(left, right);
}

function compareWithinStatus(left: FailureTag, right: FailureTag) {
  return left.status === 'reduced' ? compareReduced(left, right) : 0;
}

function compareReduced(left: FailureTag, right: FailureTag) {
  const isLeftZero = left.count === 0;
  const isRightZero = right.count === 0;
  return Number(isRightZero) - Number(isLeftZero) || countReduction(right) - countReduction(left);
}

function countReduction({count, previousCount}: FailureTag) {
  return previousCount - count;
}
