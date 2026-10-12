import type {StudyRecordOverview} from '@plan-for-myself/shared';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {studyRecordStatsQueries} from '@/study-record/queries';
import LoginNudgeCard from './LoginNudgeCard';

describe('LoginNudgeCard', () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe('General cases', () => {
    it('기록이 있고 닫은 적이 없으면 Google 계정 연결 안내가 보인다', () => {
      renderCard(RECORDED_DAYS);

      expect(screen.getByText(NUDGE_TEXT)).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('기록이 없으면 안내가 보이지 않는다', () => {
      renderCard(0);

      expect(screen.queryByText(NUDGE_TEXT)).not.toBeInTheDocument();
    });
  });
});

const TODAY = '2026-10-04';
const RECORDED_DAYS = 3;
const NUDGE_TEXT = /Google 계정을 연결하지 않으면/;

function renderCard(recordedDays: number) {
  const queryClient = new QueryClient({defaultOptions: {queries: {staleTime: Infinity, retry: false}}});
  const overview: StudyRecordOverview = {
    date: TODAY,
    firstRecordDate: recordedDays === 0 ? null : '2026-10-01',
    streak: {current: 0, longest: 0},
    totals: {recordedDays, studiedMinutes: 0},
  };
  queryClient.setQueryData(studyRecordStatsQueries.overview.key(TODAY), overview);

  render(
    <QueryClientProvider client={queryClient}>
      <LoginNudgeCard today={TODAY} />
    </QueryClientProvider>,
  );
}
