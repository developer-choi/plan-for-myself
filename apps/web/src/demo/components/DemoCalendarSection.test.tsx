import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {OverlayProvider} from 'overlay-kit';
import {describe, expect, it} from 'vitest';
import {DEMO_MONTH, DEMO_OVERVIEW, DEMO_RECORDS, DEMO_TODAY} from '@/demo/demo-examples';
import DemoCalendarSection from './DemoCalendarSection';

describe('DemoCalendarSection', () => {
  describe('General cases', () => {
    describe('지난 날짜 칸을 누르면', () => {
      it('기록이 있으면 체험 중 안내 창이 뜬다', async () => {
        renderSection();

        await userEvent.click(screen.getByRole('button', {name: RECORDED_BUTTON_NAME}));

        expect(await screen.findByRole('dialog', {name: CHOICE_MESSAGE})).toBeInTheDocument();
        expect(screen.queryByRole('button', {name: '저장'})).not.toBeInTheDocument();
      });

      it('기록이 없어도 체험 중 안내 창이 뜬다', async () => {
        renderSection();

        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        expect(await screen.findByRole('dialog', {name: CHOICE_MESSAGE})).toBeInTheDocument();
      });
    });

    describe('체험 중 안내 창이 떠 있을 때', () => {
      it('[계속 체험하기]를 누르면 안내 창이 닫힌다', async () => {
        renderSection();
        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        await userEvent.click(await screen.findByRole('button', {name: '계속 체험하기'}));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      });

      it('오른쪽 위 닫기 버튼을 누르면 안내 창이 닫힌다', async () => {
        renderSection();
        await userEvent.click(screen.getByRole('button', {name: String(EMPTY_DAY)}));

        await userEvent.click(await screen.findByRole('button', {name: '닫기'}));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      });
    });
  });
});

const CHOICE_MESSAGE = '체험 중인 상태에서는 기록을 작성할 수 없어요';
const RECORDED_DAY = 17;
const RECORDED_TOTAL_TIME = '2:30';
const RECORDED_BUTTON_NAME = new RegExp(`^${RECORDED_DAY}${RECORDED_TOTAL_TIME}`);
const EMPTY_DAY = 2;

function renderSection() {
  render(
    <OverlayProvider>
      <DemoCalendarSection month={DEMO_MONTH} overview={DEMO_OVERVIEW} records={DEMO_RECORDS} today={DEMO_TODAY} />
    </OverlayProvider>,
  );
}
