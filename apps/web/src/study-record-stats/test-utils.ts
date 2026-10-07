import type {StudyRecordMonthly} from '@plan-for-myself/shared';
import {screen} from '@testing-library/react';

interface MonthlyOverrides extends Partial<Omit<StudyRecordMonthly, 'study'>> {
  /* 공부 값을 바꾸지 않는 케이스면 비운다 */
  study?: Partial<StudyRecordMonthly['study']>;
}

export function createMonthly({study, ...overrides}: MonthlyOverrides = {}): StudyRecordMonthly {
  return {
    month: '2026-09',
    inProgress: true,
    recordedDays: {count: 21, total: 23},
    previousRecordedDays: null,
    ...overrides,
    study: {totalMinutes: 4080, weekdayAvg: 189, holidayAvg: 212, prevWeekdayAvg: 176, prevHolidayAvg: 244, ...study},
  };
}

export function getDefinitionByTerm(term: string): Element {
  const definition = screen.getAllByRole('term').find(({textContent}) => textContent === term)?.nextElementSibling;

  if (!definition) {
    throw new Error(`「${term}」 줄이 없다`);
  }

  return definition;
}

export function queryAllTermTexts(): string[] {
  return screen.queryAllByRole('term').map(({textContent}) => textContent);
}
