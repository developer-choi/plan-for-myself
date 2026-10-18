import {FAILURE_TAG_TREND_MONTH_LIMIT} from '@plan-for-myself/shared';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {Session} from 'next-auth';
import {SessionProvider} from 'next-auth/react';
import {OverlayProvider} from 'overlay-kit';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {type DemoOverview, getDemoMonth, getDemoMonthly, getDemoOverview, getDemoRecords} from '@/demo/demo-examples';
import {MY_CALENDAR_LABEL} from '@/shared/labels';
import {type CalendarMonth, shiftMonth} from '@/study-record/calendar-date';
import {FIRST_TAG_ROW_ID} from '@/study-record-stats/components/FailCard';
import DemoStatsSection from './DemoStatsSection';
import DemoStatsTour from './DemoStatsTour';

describe('DemoStatsTour', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('General cases', () => {
    describe('예시 통계가 열리면', () => {
      it('3번 말풍선의 안내 문구가 보인다', async () => {
        renderStatsWithTour(THIS_MONTH);

        expect(await screen.findByText(THIRD_TEXT)).toBeInTheDocument();
      });
    });

    describe('3번 말풍선에서 [다음]을 누르면', () => {
      it('4번 말풍선으로 넘어간다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await userEvent.click(await screen.findByRole('button', {name: NEXT}));

        expect(await screen.findByText(FOURTH_TEXT)).toBeInTheDocument();
        expect(screen.getByText('4 / 5')).toBeInTheDocument();
        expect(screen.queryByText(THIRD_TEXT)).not.toBeInTheDocument();
      });

      it('투어 끝 창은 아직 뜨지 않는다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await userEvent.click(await screen.findByRole('button', {name: NEXT}));
        await screen.findByText(FOURTH_TEXT);

        expect(screen.queryByRole('dialog', {name: TOUR_END_TITLE})).not.toBeInTheDocument();
      });
    });

    describe('4번 말풍선에서 [다음]을 누르면', () => {
      it('5번 말풍선으로 넘어간다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await goToFourthBubble();

        await userEvent.click(screen.getByRole('button', {name: NEXT}));

        expect(await screen.findByText(FIFTH_TEXT)).toBeInTheDocument();
        expect(screen.getByText('5 / 5')).toBeInTheDocument();
        expect(screen.queryByText(FOURTH_TEXT)).not.toBeInTheDocument();
      });

      it('4번이 짚은 태그의 상세가 펼쳐진다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await goToFourthBubble();

        await userEvent.click(screen.getByRole('button', {name: NEXT}));
        await screen.findByText(FIFTH_TEXT);

        expect(screen.getByRole('heading', {level: 2, name: FIRST_TAG_OF_THIS_MONTH})).toBeInTheDocument();
      });
    });

    describe('5번 말풍선에서 [마치기]를 누르면', () => {
      it('말풍선이 닫힌다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await goToFifthBubble();

        await userEvent.click(screen.getByRole('button', {name: FINISH}));

        await waitFor(() => expect(screen.queryByText(FIFTH_TEXT)).not.toBeInTheDocument());
      });

      it('투어 끝 창이 뜬다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await goToFifthBubble();

        await userEvent.click(screen.getByRole('button', {name: FINISH}));

        expect(await screen.findByRole('dialog', {name: TOUR_END_TITLE})).toBeInTheDocument();
      });
    });

    describe('로그인 상태에서 5번 말풍선의 [마치기]를 누르면', () => {
      it('[내 달력으로 이동]이 있는 투어 끝 창이 뜬다', async () => {
        renderStatsWithTour(THIS_MONTH, LOGGED_IN_SESSION);
        await goToFifthBubble();

        await userEvent.click(screen.getByRole('button', {name: FINISH}));

        expect(await screen.findByRole('dialog', {name: '이제 내 달력에서 이어서 적어 보세요'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: MY_CALENDAR_LABEL})).toBeInTheDocument();
      });
    });

    describe('3번 말풍선에서 닫기를 누르면', () => {
      it('말풍선이 모두 닫힌다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await userEvent.click(await screen.findByRole('button', {name: CLOSE}));

        await waitFor(() => expect(screen.queryByText(THIRD_TEXT)).not.toBeInTheDocument());
        expect(screen.queryByText(FOURTH_TEXT)).not.toBeInTheDocument();
      });
    });

    describe('4번 말풍선에서 닫기를 누르면', () => {
      it('태그 상세가 펼쳐지지 않는다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await goToFourthBubble();

        await userEvent.click(screen.getByRole('button', {name: CLOSE}));
        await waitFor(() => expect(screen.queryByText(FOURTH_TEXT)).not.toBeInTheDocument());

        expect(screen.queryByRole('heading', {level: 2, name: FIRST_TAG_OF_THIS_MONTH})).not.toBeInTheDocument();
      });
    });

    describe('5번 말풍선에서 닫기를 누르면', () => {
      it('투어 끝 창은 뜨지 않는다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await goToFifthBubble();

        await userEvent.click(screen.getByRole('button', {name: CLOSE}));
        await waitFor(() => expect(screen.queryByText(FIFTH_TEXT)).not.toBeInTheDocument());

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    describe('3번 말풍선이 떠 있을 때', () => {
      it('ESC를 눌러도 3번 말풍선이 그대로다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await screen.findByText(THIRD_TEXT);

        await userEvent.keyboard('{Escape}');

        expect(screen.getByText(THIRD_TEXT)).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    describe('예시 데이터가 없는 달의 통계가 열리면', () => {
      it('말풍선이 뜨지 않는다', async () => {
        vi.useFakeTimers();
        renderStatsWithTour(MONTH_WITHOUT_RECORDS);

        await waitUntilTourGivesUp();

        expect(screen.queryByText(THIRD_TEXT)).not.toBeInTheDocument();
        expect(screen.queryByText(FOURTH_TEXT)).not.toBeInTheDocument();
      });

      it('시간이 지나도 투어 끝 창이 뜨지 않는다', async () => {
        vi.useFakeTimers();
        renderStatsWithTour(MONTH_WITHOUT_RECORDS);

        await waitUntilTourGivesUp();

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    describe('4번이 짚는 태그의 상세가 이미 펼쳐져 있을 때 4번에서 [다음]을 누르면', () => {
      it('상세가 펼쳐진 채로 5번 말풍선이 뜬다', async () => {
        renderStatsWithTour(THIS_MONTH);
        await screen.findByText(THIRD_TEXT);
        fireEvent.click(document.getElementById(FIRST_TAG_ROW_ID)!);
        await userEvent.click(screen.getByRole('button', {name: NEXT}));
        await screen.findByText(FOURTH_TEXT);

        await userEvent.click(screen.getByRole('button', {name: NEXT}));

        expect(await screen.findByText(FIFTH_TEXT)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: FINISH})).toBeInTheDocument();
        expect(screen.getByRole('heading', {level: 2, name: FIRST_TAG_OF_THIS_MONTH})).toBeInTheDocument();
      });
    });
  });
});

interface StatsCase {
  month: CalendarMonth;
  overview: DemoOverview | null;
}

const NOW = new Date('2026-10-12T12:00:00+09:00');
const THIS_MONTH: StatsCase = {month: getDemoMonth(NOW), overview: getDemoOverview(NOW)};
const MONTH_WITHOUT_RECORDS: StatsCase = {
  month: shiftMonth(getDemoMonth(NOW), -FAILURE_TAG_TREND_MONTH_LIMIT),
  overview: null,
};
const THIRD_TEXT = '통계 화면이에요. 지난달과 비교해 어떤 실패가 반복되고, 새로 생기고, 줄고 있는지 보여요';
const FOURTH_TEXT = '태그를 누르면 그 실패만 모아 볼 수 있어요';
const FIFTH_TEXT = '이 실패를 한 날이 달력에 보여요. 아래에서 달마다 추이도 볼 수 있어요';
const FIRST_TAG_OF_THIS_MONTH = '늦잠';
const TOUR_END_TITLE = '이제 내 달력에 적어 볼까요?';
const LOGGED_IN_SESSION: Session = {userId: 'user-1', isGuest: false, expires: '2099-01-01T00:00:00.000Z'};
const NEXT = '다음';
const FINISH = '마치기';
const CLOSE = '닫기';
const ENOUGH_MS_FOR_TOUR_TO_GIVE_UP_ON_MISSING_TARGETS = 30_000;

function renderStatsWithTour({month, overview}: StatsCase, session: Session | null = null) {
  render(
    <SessionProvider session={session}>
      <OverlayProvider>
        <DemoStatsSection
          month={month}
          monthly={getDemoMonthly(month, NOW)}
          overview={overview}
          records={getDemoRecords(NOW)}
        />
        <DemoStatsTour />
      </OverlayProvider>
    </SessionProvider>,
  );
}

async function goToFourthBubble() {
  await userEvent.click(await screen.findByRole('button', {name: NEXT}));
  await screen.findByText(FOURTH_TEXT);
}

async function goToFifthBubble() {
  await goToFourthBubble();
  await userEvent.click(screen.getByRole('button', {name: NEXT}));
  await screen.findByText(FIFTH_TEXT);
}

async function waitUntilTourGivesUp() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ENOUGH_MS_FOR_TOUR_TO_GIVE_UP_ON_MISSING_TARGETS);
  });
}
