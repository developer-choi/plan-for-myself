import {render, screen, within} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {type TrendBar} from '@/study-record-stats/tag-detail';
import TrendBars from './TrendBars';

describe('TrendBars', () => {
  describe('General cases', () => {
    it('막대 여섯 개를 주면 막대 여섯 개가 보여야 한다', () => {
      const bars = createBars([{value: 3}, {value: 5}, {value: 2}, {value: 4}, {value: 1}, {value: 6}]);

      render(<TrendBars bars={bars} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(bars.length);
    });

    describe('진행 중인 달', () => {
      it('마지막 막대는 진행 중인 달로 표시돼야 한다', () => {
        const bars = createBars([{value: 1}, {value: 2}, {value: 3}]);

        render(<TrendBars inProgress bars={bars} />);

        expect(screen.getAllByRole('listitem')[2]).toHaveAttribute('data-in-progress');
      });

      it('마지막 막대의 월 이름 아래에 진행 중이라고 보여야 한다', () => {
        const bars = createBars([{value: 1}, {value: 2}, {value: 3}]);

        render(<TrendBars inProgress bars={bars} />);

        expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('6월진행 중');
      });

      it('마지막이 아닌 막대에는 진행 중이라고 보이지 않아야 한다', () => {
        const bars = createBars([{value: 1}, {value: 2}, {value: 3}]);

        render(<TrendBars inProgress bars={bars} />);

        expect(screen.getAllByRole('listitem')[1]).not.toHaveTextContent('진행 중');
      });

      it('마지막이 아닌 막대는 진행 중인 달로 표시되지 않아야 한다', () => {
        const bars = createBars([{value: 1}, {value: 2}, {value: 3}]);

        render(<TrendBars inProgress bars={bars} />);

        const [first, second] = screen.getAllByRole('listitem');
        expect(first).not.toHaveAttribute('data-in-progress');
        expect(second).not.toHaveAttribute('data-in-progress');
      });
    });

    it('끝난 달까지의 추이면 어느 막대도 진행 중인 달로 표시되지 않아야 한다', () => {
      const bars = createBars([{value: 1}, {value: 2}, {value: 3}]);

      render(<TrendBars bars={bars} />);

      screen.getAllByRole('listitem').forEach((item) => {
        expect(item).not.toHaveAttribute('data-in-progress');
        expect(item).not.toHaveTextContent('진행 중');
      });
    });
  });

  describe('Edge cases', () => {
    it('값이 0인 막대에는 숫자가 보이지 않아야 한다', () => {
      render(<TrendBars bars={[createBar({label: '8월', value: 0}), createBar({label: '9월', value: 2})]} />);

      expect(screen.getAllByRole('listitem')[0]).not.toHaveTextContent('0');
    });

    it('값이 0인 막대에도 월 이름은 보여야 한다', () => {
      render(<TrendBars bars={[createBar({label: '8월', value: 0}), createBar({label: '9월', value: 2})]} />);

      expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('8월');
    });

    it('값이 2인 막대에는 숫자 2가 보여야 한다', () => {
      render(<TrendBars bars={[createBar({label: '8월', value: 0}), createBar({label: '9월', value: 2})]} />);

      expect(within(screen.getAllByRole('listitem')[1]).getByText('2')).toBeInTheDocument();
    });

    it('막대가 없으면 막대가 하나도 보이지 않아야 한다', () => {
      render(<TrendBars bars={[]} />);

      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
  });
});

const MONTH_LABELS = ['4월', '5월', '6월', '7월', '8월', '9월'];

function createBar({label = '9월', value = 1, status = 'repeated'}: Partial<TrendBar> = {}): TrendBar {
  return {label, value, status};
}

function createBars(bars: Partial<TrendBar>[]): TrendBar[] {
  return bars.map((bar, index) => createBar({label: MONTH_LABELS[index], ...bar}));
}
