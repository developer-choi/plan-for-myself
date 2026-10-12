import {CalendarIcon} from '@radix-ui/react-icons';
import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import SubPageHeader from './SubPageHeader';

describe('SubPageHeader', () => {
  describe('General cases', () => {
    it('이전 달 주소가 있으면 이전 달 링크가 보인다', () => {
      renderHeader({previousHref: PREVIOUS_HREF});

      expect(screen.getByRole('link', {name: '이전 달'})).toBeInTheDocument();
    });

    it('다음 달 주소가 있으면 다음 달 링크가 보인다', () => {
      renderHeader({nextHref: NEXT_HREF});

      expect(screen.getByRole('link', {name: '다음 달'})).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('이전 달 주소가 없으면 이전 달 링크가 없다', () => {
      renderHeader({nextHref: NEXT_HREF});

      expect(screen.queryByRole('link', {name: '이전 달'})).not.toBeInTheDocument();
    });

    it('다음 달 주소가 없으면 다음 달 링크가 없다', () => {
      renderHeader({previousHref: PREVIOUS_HREF});

      expect(screen.queryByRole('link', {name: '다음 달'})).not.toBeInTheDocument();
    });
  });
});

const PREVIOUS_HREF = '/study-record-stats/2026/8';
const NEXT_HREF = '/study-record-stats/2026/10';

function renderHeader(monthNavigation: {previousHref?: string; nextHref?: string}) {
  render(
    <SubPageHeader
      exit={{href: '/study-records/2026/9', label: '달력', icon: CalendarIcon}}
      monthNavigation={monthNavigation}
      title="2026년 9월 통계"
    />,
  );
}
