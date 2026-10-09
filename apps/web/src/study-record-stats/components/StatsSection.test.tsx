import type {FailureTag, StudyRecordOverview} from '@plan-for-myself/shared';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen} from '@testing-library/react';
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
const FAIL_CARD_CASES = [
  {when: '이번 달', month: CURRENT_MONTH, title: '9월 실패'},
  {when: '지난 달', month: PREVIOUS_MONTH, title: '8월 실패'},
];

const OVERSLEEP: FailureTag = {
  tag: '늦잠',
  count: 4,
  previousCount: 3,
  status: 'repeated',
  trend: [{month: '2026-09', count: 4, previousCount: 3, status: 'repeated'}],
};

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

    FAIL_CARD_CASES.forEach(({when, month, title}) => {
      it(`${when}이면 실패 카드가 보인다`, () => {
        renderStatsSection(month);

        expect(screen.getByRole('heading', {name: title})).toBeInTheDocument();
      });
    });

    it('태그를 누르기 전에는 태그 상세 카드가 보이지 않아야 한다', () => {
      renderStatsSection(CURRENT_MONTH, [OVERSLEEP]);

      expect(screen.queryByRole('heading', {name: OVERSLEEP.tag})).not.toBeInTheDocument();
    });
  });
});

function renderStatsSection(month: CalendarMonth, failureTags: FailureTag[] = []) {
  const monthParam = toMonthParam(month);
  const queryClient = new QueryClient({defaultOptions: {queries: {staleTime: Infinity, retry: false}}});

  queryClient.setQueryData(
    studyRecordStatsQueries.monthly.key(monthParam, TODAY),
    createMonthly({month: monthParam, inProgress: monthParam === toMonthParam(CURRENT_MONTH), failureTags}),
  );
  queryClient.setQueryData(studyRecordStatsQueries.overview.key(TODAY), OVERVIEW);

  render(
    <QueryClientProvider client={queryClient}>
      <StatsSection month={month} today={TODAY} />
    </QueryClientProvider>,
  );
}
