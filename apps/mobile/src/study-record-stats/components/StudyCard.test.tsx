import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import {createMonthly} from '@/study-record-stats/test-utils';
import StudyCard from './StudyCard';

describe('StudyCard', () => {
  describe('General cases', () => {
    it('이번 달이면 누적 총 공부 줄이 보여야 한다', async () => {
      await render(<StudyCard monthly={createMonthly()} totalStudiedMinutes={870} />);

      expect(screen.getByText(TOTAL_LABEL)).toBeOnTheScreen();
    });

    it('지난 달이면 누적 총 공부 줄이 보이지 않아야 한다', async () => {
      await render(
        <StudyCard monthly={createMonthly({month: '2026-09', inProgress: false})} totalStudiedMinutes={null} />,
      );

      expect(screen.queryByText(TOTAL_LABEL)).not.toBeOnTheScreen();
    });

    it('그 달 평일 기록이 있으면 평일 평균 줄이 보여야 한다', async () => {
      await render(<StudyCard monthly={WEEKDAY_ONLY_MONTHLY} totalStudiedMinutes={null} />);

      expect(screen.getByText('평일 평균')).toBeOnTheScreen();
    });
  });

  describe('Edge cases', () => {
    it('그 달 휴일 기록이 없으면 휴일 평균 줄이 보이지 않아야 한다', async () => {
      await render(<StudyCard monthly={WEEKDAY_ONLY_MONTHLY} totalStudiedMinutes={null} />);

      expect(screen.queryByText('휴일 평균')).not.toBeOnTheScreen();
    });
  });
});

const TOTAL_LABEL = '누적 총 공부';
const WEEKDAY_ONLY_MONTHLY = createMonthly({study: {weekdayAvg: 160, holidayAvg: null}});
