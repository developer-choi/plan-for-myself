import {type Href, Redirect, router, Stack} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {act, userEvent, within} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {TestSessionProvider} from '@/auth/test-utils';
import LoggedInIntroActions from '@/intro/components/LoggedInIntroActions';
import {MENU_BUTTON_TEST_ID, MENU_MODAL_TEST_ID} from '@/shared/components/HeaderMenu';
import DemoCalendarMenu from './DemoCalendarMenu';

interface MenuLayoutProps {
  token: string | null;
}

describe('DemoCalendarMenu', () => {
  describe('General cases', () => {
    describe('로그아웃 상태면', () => {
      it('메뉴를 열면 「서비스 소개」·「개인정보 처리방침」 순서로 보여야 한다', async () => {
        const user = userEvent.setup();
        await renderMenu(null);

        await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

        expect(getItemLabels()).toEqual([INTRO_LABEL, PRIVACY_LABEL]);
      });

      describe('메뉴에서 「서비스 소개」를 누르면', () => {
        it('소개 화면으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderMenu(null);
          await rendered;
          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          await user.press(screen.getByText(INTRO_LABEL));

          expect(rendered.getPathname()).toBe(INTRO_PATH);
        });

        it('되돌아갈 화면이 없어야 한다', async () => {
          const user = userEvent.setup();
          await renderMenu(null);
          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          await user.press(screen.getByText(INTRO_LABEL));

          expect(router.canGoBack()).toBe(false);
        });
      });
    });

    describe('로그인 상태면', () => {
      it('메뉴를 열면 「내 달력으로 이동」·「서비스 소개」·「개인정보 처리방침」 순서로 보여야 한다', async () => {
        const user = userEvent.setup();
        await renderMenu(TOKEN);

        await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

        expect(getItemLabels()).toEqual([MY_CALENDAR_LABEL, INTRO_LABEL, PRIVACY_LABEL]);
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

      describe('「서비스 소개」를 누르면', () => {
        it('소개 화면으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderMenu(TOKEN, CALENDAR_PATH);
          await rendered;
          await act(() => router.push(DEMO_PATH));
          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          await user.press(screen.getByText(INTRO_LABEL));

          expect(rendered.getPathname()).toBe(INTRO_PATH);
        });

        it('되돌아갈 화면이 없어야 한다', async () => {
          const user = userEvent.setup();
          await renderMenu(TOKEN, CALENDAR_PATH);
          await act(() => router.push(DEMO_PATH));
          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));

          await user.press(screen.getByText(INTRO_LABEL));

          expect(router.canGoBack()).toBe(false);
        });

        describe('소개에서 [내 달력으로 이동]을 누르면', () => {
          it('내 달력 화면으로 가야 한다', async () => {
            const user = userEvent.setup();
            const rendered = renderMenu(TOKEN, CALENDAR_PATH);
            await rendered;
            await act(() => router.push(DEMO_PATH));
            await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));
            await user.press(screen.getByText(INTRO_LABEL));

            await user.press(screen.getByText(MY_CALENDAR_LABEL));

            expect(rendered.getPathname()).toBe(CALENDAR_PATH);
          });

          it('되돌아갈 화면이 없어야 한다', async () => {
            const user = userEvent.setup();
            await renderMenu(TOKEN, CALENDAR_PATH);
            await act(() => router.push(DEMO_PATH));
            await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));
            await user.press(screen.getByText(INTRO_LABEL));

            await user.press(screen.getByText(MY_CALENDAR_LABEL));

            expect(router.canGoBack()).toBe(false);
          });
        });
      });
    });
  });
});

const MY_CALENDAR_LABEL = '내 달력으로 이동';
const INTRO_LABEL = '서비스 소개';
const PRIVACY_LABEL = '개인정보 처리방침';
const TOKEN = 'token';
const CALENDAR_PATH = '/calendar';
const DEMO_PATH = '/demo' as Href;
const INTRO_PATH = '/intro';

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
      intro: LoggedInIntroActions,
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
