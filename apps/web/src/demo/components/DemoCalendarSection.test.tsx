import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {Session} from 'next-auth';
import {SessionProvider} from 'next-auth/react';
import {OverlayProvider} from 'overlay-kit';
import {describe, expect, it} from 'vitest';
import {getDemoMonth, getDemoOverview, getDemoRecords, getDemoToday} from '@/demo/demo-examples';
import {MY_CALENDAR_LABEL, START_RECORDING_LABEL} from '@/shared/labels';
import DemoCalendarSection from './DemoCalendarSection';

describe('DemoCalendarSection', () => {
  describe('General cases', () => {
    describe('지난 날짜 칸을 누르면', () => {
      it('기록이 있으면 예시 안내 창이 뜬다', async () => {
        renderSection();

        await userEvent.click(screen.getByRole('button', {name: RECORDED_BUTTON_NAME}));

        expect(await screen.findByRole('dialog', {name: CHOICE_MESSAGE})).toBeInTheDocument();
      });

      it('기록이 없어도 예시 안내 창이 뜬다', async () => {
        renderSection();

        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        expect(await screen.findByRole('dialog', {name: CHOICE_MESSAGE})).toBeInTheDocument();
      });

      it('안내 창의 제목에 포커스가 간다', async () => {
        renderSection();

        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        expect(await screen.findByRole('heading', {name: CHOICE_MESSAGE})).toHaveFocus();
      });
    });

    describe('예시 안내 창이 떠 있을 때', () => {
      it('[계속 둘러보기]를 누르면 안내 창이 닫힌다', async () => {
        renderSection();
        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        await userEvent.click(await screen.findByRole('button', {name: '계속 둘러보기'}));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      });

      it('오른쪽 위 닫기 버튼을 누르면 안내 창이 닫힌다', async () => {
        renderSection();
        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        const [closeButton] = within(await screen.findByRole('dialog')).getAllByRole('button');
        await userEvent.click(closeButton);

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      });
    });

    describe('로그아웃 상태에서 안내 창이 뜨면', () => {
      it('[기록 시작하기] 버튼이 보여야 한다', async () => {
        renderSection(null);

        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        expect(await screen.findByRole('link', {name: START_RECORDING_LABEL})).toBeInTheDocument();
      });

      it('[내 달력으로 이동] 버튼은 안 보여야 한다', async () => {
        renderSection(null);

        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        await screen.findByRole('dialog', {name: CHOICE_MESSAGE});
        expect(screen.queryByRole('link', {name: MY_CALENDAR_LABEL})).not.toBeInTheDocument();
      });

      it('[기록 시작하기]를 누르면 안내 창이 닫힌다', async () => {
        renderSection(null);
        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        await userEvent.click(await screen.findByRole('link', {name: START_RECORDING_LABEL}));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      });
    });

    describe('로그인 상태에서 안내 창이 뜨면', () => {
      it('[내 달력으로 이동] 버튼이 보여야 한다', async () => {
        renderSection(LOGGED_IN_SESSION);

        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        expect(await screen.findByRole('link', {name: MY_CALENDAR_LABEL})).toBeInTheDocument();
      });

      it('[기록 시작하기] 버튼은 안 보여야 한다', async () => {
        renderSection(LOGGED_IN_SESSION);

        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        await screen.findByRole('dialog', {name: CHOICE_MESSAGE});
        expect(screen.queryByRole('link', {name: START_RECORDING_LABEL})).not.toBeInTheDocument();
      });

      it('[내 달력으로 이동]을 누르면 안내 창이 닫힌다', async () => {
        renderSection(LOGGED_IN_SESSION);
        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        await userEvent.click(await screen.findByRole('link', {name: MY_CALENDAR_LABEL}));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      });
    });
  });
});

const NOW = new Date('2026-10-12T12:00:00+09:00');
const CHOICE_MESSAGE = '예시 화면에서는 기록할 수 없어요';
const RECORDED_DAY = 10;
const RECORDED_TOTAL_TIME = '3:30';
const RECORDED_BUTTON_NAME = new RegExp(`^${RECORDED_DAY}${RECORDED_TOTAL_TIME}`);
const EMPTY_DAY = 2;
const LOGGED_IN_SESSION: Session = {userId: 'user-1', isGuest: false, expires: '2099-01-01T00:00:00.000Z'};

function renderSection(session: Session | null = null) {
  render(
    <SessionProvider session={session}>
      <OverlayProvider>
        <DemoCalendarSection
          month={getDemoMonth(NOW)}
          overview={getDemoOverview(NOW)}
          records={getDemoRecords(NOW)}
          today={getDemoToday(NOW)}
        />
      </OverlayProvider>
    </SessionProvider>,
  );
}
