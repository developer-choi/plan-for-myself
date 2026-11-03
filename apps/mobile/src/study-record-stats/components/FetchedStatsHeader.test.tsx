import {useState} from 'react';
import {type CalendarMonth, type StudyRecordOverview} from '@plan-for-myself/shared';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import {NEXT_MONTH_LINK_TEST_ID, PREVIOUS_MONTH_LINK_TEST_ID} from '@/shared/components/SubPageHeader';
import {studyRecordStatsQueries} from '@/study-record/queries';
import FetchedStatsHeader from './FetchedStatsHeader';

interface HeaderWithCacheProps {
  /* 아직 받는 중인 상황이면 비운다 */
  overview?: StudyRecordOverview;
}

describe('FetchedStatsHeader', () => {
  describe('General cases', () => {
    it('첫 기록 날짜를 받는 중이면 제목은 보여야 한다', async () => {
      await render(<HeaderWithCache />);

      expect(screen.getByText('2026년 9월 통계')).toBeOnTheScreen();
    });

    it('첫 기록 날짜를 받는 중이면 이전 달 링크가 없어야 한다', async () => {
      await render(<HeaderWithCache />);

      expect(screen.queryByTestId(PREVIOUS_MONTH_LINK_TEST_ID)).not.toBeOnTheScreen();
    });

    it('첫 기록 날짜를 받는 중이면 다음 달 링크가 없어야 한다', async () => {
      await render(<HeaderWithCache />);

      expect(screen.queryByTestId(NEXT_MONTH_LINK_TEST_ID)).not.toBeOnTheScreen();
    });

    it('첫 기록 달과 이번 달 사이의 달이면 이전 달 링크가 보여야 한다', async () => {
      await render(<HeaderWithCache overview={OVERVIEW} />);

      expect(screen.getByTestId(PREVIOUS_MONTH_LINK_TEST_ID)).toBeOnTheScreen();
    });

    it('첫 기록 달과 이번 달 사이의 달이면 다음 달 링크가 보여야 한다', async () => {
      await render(<HeaderWithCache overview={OVERVIEW} />);

      expect(screen.getByTestId(NEXT_MONTH_LINK_TEST_ID)).toBeOnTheScreen();
    });
  });
});

const TODAY = '2026-10-29';
const VIEW_MONTH: CalendarMonth = {year: 2026, month: 9};
const OVERVIEW: StudyRecordOverview = {
  date: TODAY,
  firstRecordDate: '2025-01-01',
  streak: {current: 14, longest: 49},
  totals: {recordedDays: 412, studiedMinutes: 31380},
};

function HeaderWithCache({overview}: HeaderWithCacheProps) {
  const [queryClient] = useState(() => createQueryClient(overview));

  return (
    <QueryClientProvider client={queryClient}>
      <FetchedStatsHeader month={VIEW_MONTH} today={TODAY} />
    </QueryClientProvider>
  );
}

function createQueryClient(overview: HeaderWithCacheProps['overview']) {
  /* gcTime이 유한하면 화면을 치운 뒤 남은 타이머로 jest가 끝나지 않는다 */
  const queryClient = new QueryClient({defaultOptions: {queries: {enabled: false, gcTime: Infinity}}});
  if (overview) {
    queryClient.setQueryData(studyRecordStatsQueries.overview.key(TODAY), overview);
  }
  return queryClient;
}
