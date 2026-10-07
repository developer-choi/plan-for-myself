import type {StudyRecordOverview} from '@plan-for-myself/shared';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {type CalendarMonth, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordStatsQueries} from '@/study-record/queries';
import {createMonthly, queryAllTermTexts} from '@/study-record-stats/test-utils';
import StatsSection from './StatsSection';

const TODAY = '2026-09-24';
const CURRENT_MONTH: CalendarMonth = {year: 2026, month: 9};
const PREVIOUS_MONTH: CalendarMonth = {year: 2026, month: 8};
const CURRENT_MONTH_ONLY_LABELS = ['누적 기록', '연속 기록'];
const PREVIOUS_MONTH_RECORDED_DAYS_LABEL = '8월 기록한 날';

const OVERVIEW: StudyRecordOverview = {
  date: TODAY,
  firstRecordDate: '2025-01-01',
  streak: {current: 14, longest: 49},
  totals: {recordedDays: 412, studiedMinutes: 31380, improvedFailures: 7},
};

describe('StatsSection', () => {
  describe('General cases', () => {
    CURRENT_MONTH_ONLY_LABELS.forEach((label) => {
      it(`이번 달이면 ${label}이 보인다`, () => {
        renderStatsSection(CURRENT_MONTH);

        expect(queryAllTermTexts()).toContain(label);
      });

      it(`지난 달이면 ${label}이 보이지 않는다`, () => {
        renderStatsSection(PREVIOUS_MONTH);

        expect(queryAllTermTexts()).not.toContain(label);
      });
    });

    it('지난 달이면 그 달 기록한 날이 보인다', () => {
      renderStatsSection(PREVIOUS_MONTH);

      expect(queryAllTermTexts()).toContain(PREVIOUS_MONTH_RECORDED_DAYS_LABEL);
    });
  });
});

function renderStatsSection(month: CalendarMonth) {
  const monthParam = toMonthParam(month);
  const queryClient = new QueryClient({defaultOptions: {queries: {staleTime: Infinity, retry: false}}});

  queryClient.setQueryData(
    studyRecordStatsQueries.monthly.key(monthParam, TODAY),
    createMonthly({month: monthParam, inProgress: monthParam === toMonthParam(CURRENT_MONTH)}),
  );
  queryClient.setQueryData(studyRecordStatsQueries.overview.key(TODAY), OVERVIEW);

  render(
    <QueryClientProvider client={queryClient}>
      <StatsSection month={month} today={TODAY} />
    </QueryClientProvider>,
  );
}
