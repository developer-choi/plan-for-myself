import {CalendarIcon} from '@radix-ui/react-icons';
import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import SubPageHeader from './SubPageHeader';

describe('SubPageHeader', () => {
  describe('General cases', () => {
    it('이전 달 주소가 있으면 이전 달 링크가 보인다', () => {
      renderHeader({previousHref: PREVIOUS_HREF});

      expect(getLinkHrefs()).toContain(PREVIOUS_HREF);
    });

    it('다음 달 주소가 있으면 다음 달 링크가 보인다', () => {
      renderHeader({nextHref: NEXT_HREF});

      expect(getLinkHrefs()).toContain(NEXT_HREF);
    });
  });

  describe('Edge cases', () => {
    it('이전 달 주소가 없으면 이전 달 링크가 없다', () => {
      renderHeader({nextHref: NEXT_HREF});

      expect(getLinkHrefs()).toEqual([EXIT_HREF, NEXT_HREF]);
    });

    it('다음 달 주소가 없으면 다음 달 링크가 없다', () => {
      renderHeader({previousHref: PREVIOUS_HREF});

      expect(getLinkHrefs()).toEqual([EXIT_HREF, PREVIOUS_HREF]);
    });
  });
});

const EXIT_HREF = '/study-records/2026/9';
const PREVIOUS_HREF = '/study-record-stats/2026/8';
const NEXT_HREF = '/study-record-stats/2026/10';

function getLinkHrefs() {
  return screen.getAllByRole('link').map((link) => link.getAttribute('href'));
}

function renderHeader(monthNavigation: {previousHref?: string; nextHref?: string}) {
  render(
    <SubPageHeader
      exit={{href: EXIT_HREF, icon: CalendarIcon}}
      monthNavigation={monthNavigation}
      title="2026년 9월 통계"
    />,
  );
}
