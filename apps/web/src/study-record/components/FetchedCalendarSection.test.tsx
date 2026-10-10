import {minutesFormat, type StudyRecord, type StudyRecordOverview} from '@plan-for-myself/shared';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {OverlayProvider} from 'overlay-kit';
import {describe, expect, it} from 'vitest';
import {formatDateTitle, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';
import FetchedCalendarSection from './FetchedCalendarSection';

describe('FetchedCalendarSection', () => {
  describe('General cases', () => {
    describe('기록이 있는 지난 날짜 칸을 누르면', () => {
      it('그 날짜의 기록 창이 뜬다', async () => {
        renderSection(OVERVIEW);

        await userEvent.click(screen.getByRole('button', {name: RECORD_BUTTON_NAME}));

        expect(await screen.findByRole('dialog', {name: formatDateTitle(RECORD.date)})).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    describe('첫 기록이 없으면', () => {
      it('첫 기록 안내가 보인다', () => {
        renderSection({...OVERVIEW, firstRecordDate: null});

        expect(screen.getByRole('heading', {name: '첫 기록을 남겨 보세요'})).toBeInTheDocument();
      });

      it('달력이 보이지 않는다', () => {
        renderSection({...OVERVIEW, firstRecordDate: null});

        expect(screen.queryByRole('button', {name: RECORD_BUTTON_NAME})).not.toBeInTheDocument();
      });
    });
  });
});

const MONTH = {year: 2026, month: 10};
const TODAY = '2026-10-04';
const RECORD_DATE = '2026-10-02';
const [, , RECORD_DAY_TEXT] = RECORD_DATE.split('-');
const RECORD_DAY = Number(RECORD_DAY_TEXT);
const RECORD: StudyRecord = {
  pk: 1,
  date: RECORD_DATE,
  dateType: 'weekday',
  studiedMinutes: [0, 0, 0],
  failTags: ['영어'],
};
const RECORD_BUTTON_NAME = new RegExp(`^${RECORD_DAY}${minutesFormat(0)}`);
const OVERVIEW: StudyRecordOverview = {
  date: TODAY,
  firstRecordDate: '2026-09-01',
  streak: {current: 3, longest: 5},
  totals: {recordedDays: 10, studiedMinutes: 600, improvedFailures: 1},
};

function renderSection(overview: StudyRecordOverview) {
  const queryClient = new QueryClient({defaultOptions: {queries: {staleTime: Infinity, retry: false}}});

  queryClient.setQueryData(studyRecordQueries.list.key(toMonthParam(MONTH)), [RECORD]);
  queryClient.setQueryData(studyRecordStatsQueries.overview.key(TODAY), overview);

  render(
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <FetchedCalendarSection month={MONTH} today={TODAY} />
      </OverlayProvider>
    </QueryClientProvider>,
  );
}
