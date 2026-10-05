import type {StudyRecord, StudyRecordOverview} from '@plan-for-myself/shared';
import {addDays, addMonths, listMonths, toMonth} from './date';
import {sumMinutes} from './minutes';
import {countTagsByMonth, getTagCount} from './tag-count';

export function calculateOverview(records: StudyRecord[], date: string): StudyRecordOverview {
  const recordsUntilDate = records.filter((record) => record.date <= date);
  const dates = recordsUntilDate.map((record) => record.date).sort();
  const firstRecordDate = dates.at(0) ?? null;

  return {
    date,
    firstRecordDate,
    streak: {current: countCurrentStreak(new Set(dates), date), longest: countLongestStreak(dates)},
    totals: {
      recordedDays: recordsUntilDate.length,
      studiedMinutes: recordsUntilDate.reduce((sum, record) => sum + sumMinutes(record), 0),
      improvedFailures: firstRecordDate ? countImprovedFailures(recordsUntilDate, toMonth(firstRecordDate), date) : 0,
    },
  };
}

/* 요청한 날짜는 아직 안 끝났으니 기록이 없어도 끊지 않는다. 전날까지 세고, 그날을 기록했으면 1을 더한다 */
function countCurrentStreak(dates: Set<string>, date: string) {
  let count = 0;
  for (let cursor = addDays(date, -1); dates.has(cursor); cursor = addDays(cursor, -1)) {
    count++;
  }
  return dates.has(date) ? count + 1 : count;
}

function countLongestStreak(sortedDates: string[]) {
  let longest = 0;
  let run = 0;

  sortedDates.forEach((date, index) => {
    const continuesPreviousDay = index > 0 && addDays(sortedDates[index - 1], 1) === date;
    run = continuesPreviousDay ? run + 1 : 1;
    longest = Math.max(longest, run);
  });

  return longest;
}

/* 끝난 달마다 그 전달보다 횟수가 줄어든 태그 수를 더한다(0번이 된 태그 포함). 뒤에 다시 늘어도 빼지 않는다 */
function countImprovedFailures(records: StudyRecord[], firstMonth: string, date: string) {
  const counts = countTagsByMonth(records);
  let improved = 0;

  for (const month of listMonths(addMonths(firstMonth, 1), addMonths(toMonth(date), -1))) {
    const previousMonth = addMonths(month, -1);
    for (const [tag, previousCount] of counts.get(previousMonth) ?? []) {
      if (getTagCount(counts, month, tag) < previousCount) {
        improved++;
      }
    }
  }

  return improved;
}
