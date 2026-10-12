import {render, screen} from '@testing-library/react';
import {createRef} from 'react';
import {describe, expect, it} from 'vitest';
import {type TrendBar} from '@/study-record-stats/tag-detail';
import TagDetailCard from './TagDetailCard';

describe('TagDetailCard', () => {
  describe('General cases', () => {
    it('막대가 여러 개면 월별 추이가 보여야 한다', () => {
      const bars = createBars(['4월', '5월', '6월', '7월', '8월', '9월']);

      render(
        <TagDetailCard ref={createRef()} calendar={<p>달력 자리</p>} tag="야식" trend={{bars, inProgress: true}} />,
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(bars.length);
    });
  });

  describe('Boundary cases', () => {
    it('막대가 2개면 월별 추이가 보여야 한다', () => {
      const bars = createBars(['8월', '9월']);

      render(
        <TagDetailCard ref={createRef()} calendar={<p>달력 자리</p>} tag="야식" trend={{bars, inProgress: false}} />,
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(bars.length);
    });

    it('막대가 1개면 월별 추이가 없어야 한다', () => {
      const bars = createBars(['9월']);

      render(
        <TagDetailCard ref={createRef()} calendar={<p>달력 자리</p>} tag="두통" trend={{bars, inProgress: true}} />,
      );

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });
});

function createBars(labels: string[]): TrendBar[] {
  return labels.map((label) => ({label, value: 1, status: 'repeated'}));
}
