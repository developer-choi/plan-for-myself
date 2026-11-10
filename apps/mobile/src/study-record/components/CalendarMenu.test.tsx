import {router, Stack} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {act, userEvent} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {TestSessionProvider} from '@/auth/test-utils';
import {MENU_BUTTON_TEST_ID} from '@/shared/components/HeaderMenu';
import CalendarMenu from './CalendarMenu';

describe('CalendarMenu', () => {
  describe('General cases', () => {
    describe('메뉴에서 「서비스 소개」를 누르면', () => {
      it('소개 화면으로 가야 한다', async () => {
        const rendered = renderMenu();
        await rendered;

        await openIntro();

        expect(rendered.getPathname()).toBe('/intro');
      });

      it('뒤로 가면 달력으로 돌아와야 한다', async () => {
        const rendered = renderMenu();
        await rendered;
        await openIntro();

        await act(() => router.back());

        expect(rendered.getPathname()).toBe(CALENDAR_PATH);
      });
    });
  });
});

const CALENDAR_PATH = '/calendar';

async function openIntro() {
  const user = userEvent.setup();
  await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));
  await user.press(screen.getByText('서비스 소개'));
}

function renderMenu() {
  return renderRouter(
    {
      /* expo-router 파일 이름(`_layout`)이 레포 이름 규칙에 걸려 계산된 키로 적는다 */
      ['_layout']: MenuLayout,
      calendar: CalendarMenu,
      intro: EmptyScreen,
    },
    {initialUrl: CALENDAR_PATH},
  );
}

function MenuLayout() {
  return (
    <TestSessionProvider token="token">
      <Stack />
    </TestSessionProvider>
  );
}

function EmptyScreen() {
  return null;
}
