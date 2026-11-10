import {type Href} from 'expo-router';
import {Lucide} from '@react-native-vector-icons/lucide';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import SubPageHeader, {NEXT_MONTH_LINK_TEST_ID, PREVIOUS_MONTH_LINK_TEST_ID} from './SubPageHeader';

interface MonthNavigation {
  previousHref?: Href;
  nextHref?: Href;
}

describe('SubPageHeader', () => {
  describe('General cases', () => {
    it('지난 달 통계로 갈 수 있으면 이전 달 링크가 보여야 한다', async () => {
      await renderHeader({previousHref: PREVIOUS_HREF});

      expect(screen.getByTestId(PREVIOUS_MONTH_LINK_TEST_ID)).toBeOnTheScreen();
    });

    it('다음 달 통계로 갈 수 있으면 다음 달 링크가 보여야 한다', async () => {
      await renderHeader({nextHref: NEXT_HREF});

      expect(screen.getByTestId(NEXT_MONTH_LINK_TEST_ID)).toBeOnTheScreen();
    });

    it('달을 넘겨 보지 않는 화면이면 제목만 보이고 달 링크가 없어야 한다', async () => {
      await render(<SubPageHeader exit={EXIT} title={ACCOUNT_TITLE} />);

      expect(screen.getByText(ACCOUNT_TITLE)).toBeOnTheScreen();
      expect(screen.queryByTestId(PREVIOUS_MONTH_LINK_TEST_ID)).not.toBeOnTheScreen();
      expect(screen.queryByTestId(NEXT_MONTH_LINK_TEST_ID)).not.toBeOnTheScreen();
    });
  });

  describe('Edge cases', () => {
    it('지난 달 통계로 갈 수 없으면 이전 달 링크가 없어야 한다', async () => {
      await renderHeader({nextHref: NEXT_HREF});

      expect(screen.queryByTestId(PREVIOUS_MONTH_LINK_TEST_ID)).not.toBeOnTheScreen();
    });

    it('다음 달 통계로 갈 수 없으면 다음 달 링크가 없어야 한다', async () => {
      await renderHeader({previousHref: PREVIOUS_HREF});

      expect(screen.queryByTestId(NEXT_MONTH_LINK_TEST_ID)).not.toBeOnTheScreen();
    });
  });
});

const PREVIOUS_HREF: Href = '/study-record-stats/2026/8';
const NEXT_HREF: Href = '/study-record-stats/2026/10';
const EXIT = {href: '/study-records/2026/9', icon: <Lucide name="calendar" />} as const;
const ACCOUNT_TITLE = '계정';

async function renderHeader(monthNavigation: MonthNavigation) {
  await render(<SubPageHeader exit={EXIT} monthNavigation={monthNavigation} title="2026년 9월 통계" />);
}
