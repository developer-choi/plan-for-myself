import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import {createMonthly} from '@/study-record-stats/test-utils';
import RecordCard from './RecordCard';

const CURRENT_MONTH_ONLY_LABELS = ['연속 기록', '누적 기록'];

describe('RecordCard', () => {
  describe('General cases', () => {
    CURRENT_MONTH_ONLY_LABELS.forEach((label) => {
      it(`이번 달이면 ${label} 줄이 보여야 한다`, async () => {
        await render(<RecordCard monthly={createMonthly()} streak={STREAK} totalRecordedDays={TOTAL_RECORDED_DAYS} />);

        expect(screen.getByText(label)).toBeOnTheScreen();
      });
    });

    CURRENT_MONTH_ONLY_LABELS.forEach((label) => {
      it(`지난 달이면 ${label} 줄이 보이지 않아야 한다`, async () => {
        await render(<RecordCard monthly={PREVIOUS_MONTHLY} streak={null} totalRecordedDays={null} />);

        expect(screen.queryByText(label)).not.toBeOnTheScreen();
      });
    });

    it('기록할 수 있었던 날을 모두 기록했으면 빠짐없이 남겼다는 문장이 보여야 한다', async () => {
      await render(
        <RecordCard
          monthly={createMonthly({recordedDays: {count: 10, total: 10}})}
          streak={null}
          totalRecordedDays={null}
        />,
      );

      expect(screen.getByText('빠짐없이 남겼어요')).toBeOnTheScreen();
    });

    it('기록하지 못한 날이 있으면 남기지 못한 날 수가 보여야 한다', async () => {
      await render(
        <RecordCard
          monthly={createMonthly({recordedDays: {count: 7, total: 10}})}
          streak={null}
          totalRecordedDays={null}
        />,
      );

      expect(screen.getByText('남기지 못한 날이 3일 있어요')).toBeOnTheScreen();
    });
  });

  describe('Boundary cases', () => {
    it('그달 1일에 아직 기록하기 전이면 첫 기록을 남기라는 문장이 보여야 한다', async () => {
      await render(
        <RecordCard
          monthly={createMonthly({recordedDays: {count: 0, total: 0}})}
          streak={null}
          totalRecordedDays={null}
        />,
      );

      expect(screen.getByText('오늘 첫 기록을 남겨 보세요')).toBeOnTheScreen();
    });
  });
});

const STREAK = {current: 3, longest: 5};
const TOTAL_RECORDED_DAYS = 40;
const PREVIOUS_MONTHLY = createMonthly({month: '2026-09', inProgress: false});
