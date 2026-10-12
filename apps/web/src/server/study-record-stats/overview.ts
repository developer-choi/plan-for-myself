import type {StudyRecord, StudyRecordOverview} from '@plan-for-myself/shared';
import {addDays} from './date';
import {sumMinutes} from './minutes';

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
