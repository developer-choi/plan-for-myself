import {createRef, Suspense, useState} from 'react';
import {type CalendarMonth, toMonthParam} from '@plan-for-myself/shared/date';
import {colors} from '@plan-for-myself/shared/color';
import type {StudyRecord, StudyRecordOverview} from '@plan-for-myself/shared/study-record';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {describe, expect, it} from '@jest/globals';
import {render, screen, userEvent} from '@testing-library/react-native';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';
import {TAG_ROW_TEST_ID_PREFIX} from '@/study-record-stats/components/FailCard';
import {DAY_TEST_ID_PREFIX} from '@/study-record-stats/components/TagCalendar';
import {createFailureTag, createMonthly, createStudyRecord} from '@/study-record-stats/test-utils';
import FetchedStatsSection from './FetchedStatsSection';

interface SectionWithCacheProps {
  month: CalendarMonth;
}

const CURRENT_MONTH_ONLY_LABELS = ['연속 기록', '누적 기록', '누적 총 공부'];

describe('FetchedStatsSection', () => {
  describe('General cases', () => {
    CURRENT_MONTH_ONLY_LABELS.forEach((label) => {
      it(`이번 달이면 ${label} 줄이 보여야 한다`, async () => {
        await render(<SectionWithCache month={CURRENT_MONTH} />);

        expect(await screen.findByText(label)).toBeOnTheScreen();
      });
    });

    it('지난 달이면 그 달 기록 줄이 보여야 한다', async () => {
      await render(<SectionWithCache month={PREVIOUS_MONTH} />);

      expect(await screen.findByText(PREVIOUS_MONTH_RECORDED_DAYS_LABEL)).toBeOnTheScreen();
    });

    it('지난 달이면 그 달 총 공부 줄이 보여야 한다', async () => {
      await render(<SectionWithCache month={PREVIOUS_MONTH} />);

      expect(await screen.findByText('9월 총 공부')).toBeOnTheScreen();
    });

    CURRENT_MONTH_ONLY_LABELS.forEach((label) => {
      it(`지난 달이면 ${label} 줄이 보이지 않아야 한다`, async () => {
        await render(<SectionWithCache month={PREVIOUS_MONTH} />);
        await screen.findByText(PREVIOUS_MONTH_RECORDED_DAYS_LABEL);

        expect(screen.queryByText(label)).not.toBeOnTheScreen();
      });
    });

    describe('실패 태그 줄을 눌러 연 태그 달력', () => {
      it('그 태그를 적은 날 칸은 빨강이어야 한다', async () => {
        const user = userEvent.setup();
        await render(<SectionWithCache month={PREVIOUS_MONTH} />);

        await user.press(await screen.findByTestId(`${TAG_ROW_TEST_ID_PREFIX}${SNACK}`));

        expect(await screen.findByTestId(`${DAY_TEST_ID_PREFIX}${SNACK_DAY}`)).toHaveStyle({
          backgroundColor: colors.fail,
        });
      });

      it('다른 태그만 적은 날 칸은 빨강이 아니어야 한다', async () => {
        const user = userEvent.setup();
        await render(<SectionWithCache month={PREVIOUS_MONTH} />);

        await user.press(await screen.findByTestId(`${TAG_ROW_TEST_ID_PREFIX}${SNACK}`));

        expect(await screen.findByTestId(`${DAY_TEST_ID_PREFIX}${OVERSLEEP_DAY}`)).not.toHaveStyle({
          backgroundColor: colors.fail,
        });
      });
    });
  });
});

const TODAY = '2026-10-29';
const CURRENT_MONTH: CalendarMonth = {year: 2026, month: 10};
const PREVIOUS_MONTH: CalendarMonth = {year: 2026, month: 9};
const PREVIOUS_MONTH_RECORDED_DAYS_LABEL = '9월 기록';
const OVERVIEW: StudyRecordOverview = {
  date: TODAY,
  firstRecordDate: '2025-01-01',
  streak: {current: 14, longest: 49},
  totals: {recordedDays: 412, studiedMinutes: 31380},
};
const SNACK = '야식';
const OVERSLEEP = '늦잠';
const SNACK_DAY = 3;
const OVERSLEEP_DAY = 4;
const SNACK_DATE = `2026-09-${String(SNACK_DAY).padStart(2, '0')}`;
const OVERSLEEP_DATE = `2026-09-${String(OVERSLEEP_DAY).padStart(2, '0')}`;
const RECORDS: StudyRecord[] = [
  createStudyRecord({pk: 1, date: SNACK_DATE, failTags: [SNACK]}),
  createStudyRecord({pk: 2, date: OVERSLEEP_DATE, failTags: [OVERSLEEP]}),
];

function SectionWithCache({month}: SectionWithCacheProps) {
  const [queryClient] = useState(() => createQueryClient(month));

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <FetchedStatsSection month={month} scrollViewRef={createRef()} today={TODAY} />
      </Suspense>
    </QueryClientProvider>
  );
}

function createQueryClient(month: CalendarMonth) {
  /* gcTime이 유한하면 화면을 치운 뒤 남은 타이머로 jest가 끝나지 않는다 */
  const queryClient = new QueryClient({defaultOptions: {queries: {staleTime: Infinity, gcTime: Infinity}}});
  const monthParam = toMonthParam(month);
  queryClient.setQueryData(
    studyRecordStatsQueries.monthly.key(monthParam, TODAY),
    createMonthly({
      month: monthParam,
      inProgress: monthParam === toMonthParam(CURRENT_MONTH),
      failureTags: [createFailureTag({tag: SNACK}), createFailureTag({tag: OVERSLEEP})],
    }),
  );
  queryClient.setQueryData(studyRecordStatsQueries.overview.key(TODAY), OVERVIEW);
  queryClient.setQueryData(studyRecordQueries.list.key(monthParam), RECORDS);
  return queryClient;
}
