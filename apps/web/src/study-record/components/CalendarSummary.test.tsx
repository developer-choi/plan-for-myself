import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import CalendarSummary from './CalendarSummary';

describe('CalendarSummary', () => {
  describe('General cases', () => {
    it('갈 통계가 있으면 통계 버튼이 보인다', () => {
      render(<CalendarSummary statsHref="/study-record-stats/2026/9" />);

      expect(screen.getByRole('link', {name: '통계'})).toBeInTheDocument();
    });

    it('갈 통계가 없으면 통계 버튼이 보이지 않는다', () => {
      render(<CalendarSummary />);

      expect(screen.queryByRole('link', {name: '통계'})).not.toBeInTheDocument();
    });
  });
});
