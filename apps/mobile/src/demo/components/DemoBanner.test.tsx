import {type Href, Redirect, router, Stack} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {act, userEvent} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {TestSessionProvider} from '@/auth/test-utils';
import DemoBanner from './DemoBanner';

interface BannerLayoutProps {
  token: string | null;
}

describe('DemoBanner', () => {
  describe('General cases', () => {
    describe('로그아웃 상태면', () => {
      it('[기록 시작하기]가 보여야 한다', async () => {
        await renderBanner(null);

        expect(screen.getByText(START_LABEL)).toBeOnTheScreen();
      });

      it('[내 달력으로 이동]은 보이지 않아야 한다', async () => {
        await renderBanner(null);

        expect(screen.queryByText(MY_CALENDAR_LABEL)).not.toBeOnTheScreen();
      });

      describe('[기록 시작하기]를 누르면', () => {
        it('로그인 화면으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderBanner(null);
          await rendered;

          await user.press(screen.getByText(START_LABEL));

          expect(rendered.getPathname()).toBe('/sign-in');
        });

        it('뒤로 가도 예시 화면으로 돌아오지 않아야 한다', async () => {
          const user = userEvent.setup();
          await renderBanner(null);

          await user.press(screen.getByText(START_LABEL));

          expect(router.canGoBack()).toBe(false);
        });
      });
    });

    describe('로그인 상태면', () => {
      it('[내 달력으로 이동]이 보여야 한다', async () => {
        await renderBanner(TOKEN);

        expect(screen.getByText(MY_CALENDAR_LABEL)).toBeOnTheScreen();
      });

      it('[기록 시작하기]는 보이지 않아야 한다', async () => {
        await renderBanner(TOKEN);

        expect(screen.queryByText(START_LABEL)).not.toBeOnTheScreen();
      });

      describe('[내 달력으로 이동]을 누르면', () => {
        it('내 달력 화면으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderBanner(TOKEN);
          await rendered;

          await user.press(screen.getByText(MY_CALENDAR_LABEL));

          expect(rendered.getPathname()).toBe(CALENDAR_PATH);
        });

        it('뒤로 가도 예시 화면으로 돌아오지 않아야 한다', async () => {
          const user = userEvent.setup();
          await renderBanner(TOKEN);

          await user.press(screen.getByText(MY_CALENDAR_LABEL));

          expect(router.canGoBack()).toBe(false);
        });
      });

      describe('달력 메뉴로 들어와', () => {
        it('[내 달력으로 이동]을 누르면 뒤로 갈 화면이 남지 않아야 한다', async () => {
          const user = userEvent.setup();
          await renderBanner(TOKEN, CALENDAR_PATH);
          await act(() => router.push(DEMO_PATH));

          await user.press(screen.getByText(MY_CALENDAR_LABEL));

          expect(router.canGoBack()).toBe(false);
        });
      });
    });
  });
});

const START_LABEL = '기록 시작하기';
const MY_CALENDAR_LABEL = '내 달력으로 이동';
const TOKEN = 'token';
const CALENDAR_PATH = '/calendar';
const DEMO_PATH = '/demo' as Href;

function renderBanner(token: string | null, initialUrl = '/demo') {
  return renderRouter(
    {
      ['_layout']: () => <BannerLayout token={token} />,
      index: HomeScreen,
      calendar: EmptyScreen,
      demo: DemoBanner,
      'sign-in': EmptyScreen,
    },
    {initialUrl},
  );
}

function BannerLayout({token}: BannerLayoutProps) {
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
