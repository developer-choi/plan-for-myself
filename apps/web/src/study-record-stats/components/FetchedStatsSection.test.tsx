import type {StudyRecordOverview} from '@plan-for-myself/shared';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {type CalendarMonth, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordStatsQueries} from '@/study-record/queries';
import {createMonthly, queryAllTermTexts} from '@/study-record-stats/test-utils';
import FetchedStatsSection from './FetchedStatsSection';

interface RenderSectionOptions {
  withOverview: boolean;
  inProgress: boolean;
}

const CURRENT_MONTH_ONLY_LABELS = ['누적 기록', '누적 총 공부', '연속 기록'];

describe('FetchedStatsSection', () => {
  describe('General cases', () => {
    CURRENT_MONTH_ONLY_LABELS.forEach((label) => {
      it(`이번 달이면 ${label} 줄이 보인다`, () => {
        renderSection(CURRENT_MONTH, {withOverview: true, inProgress: true});

        expect(queryAllTermTexts()).toContain(label);
      });
    });
  });

  describe('Edge cases', () => {
    it('지난 달이면 그 달 통계가 보인다', () => {
      renderSection(PREVIOUS_MONTH, {withOverview: false, inProgress: false});

      expect(queryAllTermTexts()).toContain(PREVIOUS_MONTH_RECORDED_DAYS_LABEL);
    });

    CURRENT_MONTH_ONLY_LABELS.forEach((label) => {
      it(`지난 달이면 ${label} 줄이 보이지 않는다`, () => {
        renderSection(PREVIOUS_MONTH, {withOverview: false, inProgress: false});

        expect(queryAllTermTexts()).not.toContain(label);
      });
    });
  });
});

const TODAY = '2026-09-24';
const CURRENT_MONTH: CalendarMonth = {year: 2026, month: 9};
const PREVIOUS_MONTH: CalendarMonth = {year: 2026, month: 8};
const PREVIOUS_MONTH_RECORDED_DAYS_LABEL = '8월 기록';
const OVERVIEW: StudyRecordOverview = {
  date: TODAY,
  firstRecordDate: '2025-01-01',
  streak: {current: 14, longest: 49},
  totals: {recordedDays: 412, studiedMinutes: 31380},
};

function renderSection(month: CalendarMonth, {withOverview, inProgress}: RenderSectionOptions) {
  const monthParam = toMonthParam(month);
  const queryClient = new QueryClient({defaultOptions: {queries: {staleTime: Infinity, retry: false}}});

  queryClient.setQueryData(
    studyRecordStatsQueries.monthly.key(monthParam, TODAY),
    createMonthly({month: monthParam, inProgress}),
  );
  if (withOverview) {
    queryClient.setQueryData(studyRecordStatsQueries.overview.key(TODAY), OVERVIEW);
  }

  render(
    <QueryClientProvider client={queryClient}>
      <FetchedStatsSection month={month} today={TODAY} />
    </QueryClientProvider>,
  );
}
