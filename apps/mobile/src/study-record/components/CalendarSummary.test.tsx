import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import CalendarSummary from './CalendarSummary';

describe('CalendarSummary', () => {
  describe('General cases', () => {
    it('통계를 볼 수 있는 달이면 [통계]가 보여야 한다', async () => {
      await render(<CalendarSummary statsHref={STATS_HREF} />);

      expect(screen.getByText(STATS_LABEL)).toBeOnTheScreen();
    });

    it('통계를 볼 수 없는 달이면 [통계]가 보이지 않아야 한다', async () => {
      await render(<CalendarSummary />);

      expect(screen.queryByText(STATS_LABEL)).not.toBeOnTheScreen();
    });
  });
});

const STATS_HREF = '/study-record-stats/2026/10';
const STATS_LABEL = '통계';
