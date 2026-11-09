import type {CalendarMonth} from '@plan-for-myself/shared/date';
import {renderRouter, screen} from 'expo-router/testing-library';
import {describe, expect, it} from '@jest/globals';
import {NEXT_MONTH_LINK_TEST_ID, PREVIOUS_MONTH_LINK_TEST_ID} from '@/shared/components/SubPageHeader';
import DemoStatsHeader from './DemoStatsHeader';

describe('DemoStatsHeader', () => {
  describe('Boundary cases', () => {
    it('예시 이번 달이면 다음 달 이동이 보이지 않아야 한다', async () => {
      await renderHeader(THIS_MONTH);

      expect(screen.queryByTestId(NEXT_MONTH_LINK_TEST_ID)).not.toBeOnTheScreen();
    });

    it('예시 이번 달의 앞 달이면 다음 달 이동이 보여야 한다', async () => {
      await renderHeader({year: 2026, month: 9});

      expect(screen.getByTestId(NEXT_MONTH_LINK_TEST_ID)).toBeOnTheScreen();
    });

    it('예시 첫 기록 달이면 이전 달 이동이 보이지 않아야 한다', async () => {
      await renderHeader(FIRST_RECORD_MONTH);

      expect(screen.queryByTestId(PREVIOUS_MONTH_LINK_TEST_ID)).not.toBeOnTheScreen();
    });

    it('예시 첫 기록 달의 다음 달이면 이전 달 이동이 보여야 한다', async () => {
      await renderHeader({year: 2026, month: 6});

      expect(screen.getByTestId(PREVIOUS_MONTH_LINK_TEST_ID)).toBeOnTheScreen();
    });
  });
});

const THIS_MONTH = {year: 2026, month: 10};
const FIRST_RECORD_MONTH = {year: 2026, month: 5};
const TODAY = '2026-10-31';
const FIRST_RECORD_DATE = '2026-05-04';

function renderHeader(month: CalendarMonth) {
  return renderRouter({
    index: () => <DemoStatsHeader firstRecordDate={FIRST_RECORD_DATE} month={month} today={TODAY} />,
  });
}
