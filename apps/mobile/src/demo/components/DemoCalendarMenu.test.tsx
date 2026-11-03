import {type Href, Redirect, router, Stack} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {act, userEvent, within} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {TestSessionProvider} from '@/auth/test-utils';
import {MENU_BUTTON_TEST_ID, MENU_MODAL_TEST_ID} from '@/shared/components/HeaderMenu';
import DemoCalendarMenu from './DemoCalendarMenu';

interface MenuLayoutProps {
  token: string | null;
}

describe('DemoCalendarMenu', () => {
  describe('General cases', () => {
    describe('로그아웃 상태면', () => {
      it('메뉴를 열면 「개인정보 처리방침」만 보여야 한다', async () => {
        const user = userEvent.setup();
        await renderMenu(null);

        await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

        expect(getItemLabels()).toEqual([PRIVACY_LABEL]);
      });
    });

    describe('로그인 상태면', () => {
      describe('메뉴를 열면', () => {
        it('항목이 둘이어야 한다', async () => {
          const user = userEvent.setup();
          await renderMenu(TOKEN);

          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          expect(getItemLabels()).toHaveLength(LOGGED_IN_ITEM_COUNT);
        });

        it('「내 달력으로 이동」이 맨 위에 보여야 한다', async () => {
          const user = userEvent.setup();
          await renderMenu(TOKEN);

          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          expect(getItemLabels()[0]).toBe(MY_CALENDAR_LABEL);
        });

        it('「개인정보 처리방침」이 「내 달력으로 이동」 아래에 보여야 한다', async () => {
          const user = userEvent.setup();
          await renderMenu(TOKEN);

          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          expect(getItemLabels()[1]).toBe(PRIVACY_LABEL);
        });
      });
    });

    describe('달력 메뉴로 들어와', () => {
      describe('「내 달력으로 이동」을 누르면', () => {
        it('내 달력 화면으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderMenu(TOKEN, CALENDAR_PATH);
          await rendered;
          await act(() => router.push(DEMO_PATH));
          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          await user.press(screen.getByText(MY_CALENDAR_LABEL));

          expect(rendered.getPathname()).toBe(CALENDAR_PATH);
        });

        it('뒤로 가도 예시 화면으로 돌아오지 않아야 한다', async () => {
          const user = userEvent.setup();
          await renderMenu(TOKEN, CALENDAR_PATH);
          await act(() => router.push(DEMO_PATH));
          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          await user.press(screen.getByText(MY_CALENDAR_LABEL));

          expect(router.canGoBack()).toBe(false);
        });
      });
    });
  });
});

const MY_CALENDAR_LABEL = '내 달력으로 이동';
const PRIVACY_LABEL = '개인정보 처리방침';
const TOKEN = 'token';
const LOGGED_IN_ITEM_COUNT = 2;
const CALENDAR_PATH = '/calendar';
const DEMO_PATH = '/demo' as Href;

function getItemLabels() {
  return within(screen.getByTestId(MENU_MODAL_TEST_ID))
    .getAllByText(/.+/)
    .map((item) => String(item.props.children));
}

function renderMenu(token: string | null, initialUrl = '/demo') {
  return renderRouter(
    {
      ['_layout']: () => <MenuLayout token={token} />,
      index: HomeScreen,
      calendar: EmptyScreen,
      demo: DemoCalendarMenu,
    },
    {initialUrl},
  );
}

function MenuLayout({token}: MenuLayoutProps) {
  return (
    <TestSessionProvider token={token}>
      <Stack />
    </TestSessionProvider>
  );
}

function HomeScreen() {
  return <Redirect href={CALENDAR_PATH as Href} />;
}

function EmptyScreen() {
  return null;
}
