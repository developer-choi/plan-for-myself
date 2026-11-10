import {useEffect, useState} from 'react';
import {Redirect, router} from 'expo-router';
import {renderRouter, screen} from 'expo-router/testing-library';
import {act, userEvent} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {DEMO_HOME_URL, demoCalendarPath, getKoreanDate, monthPath} from '@plan-for-myself/shared';
import IntroScreen from '@/app/intro';
import SignInScreen from '@/app/sign-in';
import {getConnectOutcomeHref} from '@/auth/connect-outcome';
import {TestSessionProvider} from '@/auth/test-utils';
import DemoBanner from '@/demo/components/DemoBanner';
import DemoCalendarMenu from '@/demo/components/DemoCalendarMenu';
import {MENU_BUTTON_TEST_ID} from '@/shared/components/HeaderMenu';
import RootNavigator from '@/shared/components/RootNavigator';

interface GuardedLayoutProps {
  initialToken: string | null;
}

describe('소개 화면 이동', () => {
  describe('General cases', () => {
    describe('로그아웃 상태로 앱을 켜면', () => {
      it('소개 화면이 첫 화면이어야 한다', async () => {
        const rendered = renderApp(null);
        await rendered;

        expect(rendered.getPathname()).toBe(INTRO_PATH);
      });
    });

    describe('달력에서 로그아웃 상태가 되면', () => {
      it('소개 화면으로 가야 한다', async () => {
        const rendered = renderApp(GOOGLE_TOKEN, CALENDAR_PATH);
        await rendered;

        await act(() => changeToken(null));

        expect(rendered.getPathname()).toBe(INTRO_PATH);
      });
    });

    describe('소개에서 [기록 시작하기]로 로그인 화면을 연 뒤', () => {
      it('로그인 상태가 되면 달력으로 가야 한다', async () => {
        const user = userEvent.setup();
        const rendered = renderApp(null, INTRO_PATH);
        await rendered;
        const [heroStartButton] = screen.getAllByText(START_LABEL);
        await user.press(heroStartButton);

        await act(() => changeToken(GOOGLE_TOKEN));

        expect(rendered.getPathname()).toBe(CALENDAR_PATH);
      });

      describe('게스트 상태가 되어', () => {
        it('홈으로 가면 달력으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderApp(null, INTRO_PATH);
          await rendered;
          const [heroStartButton] = screen.getAllByText(START_LABEL);
          await user.press(heroStartButton);

          await act(() => {
            changeToken(GUEST_TOKEN);
            router.replace('/');
          });

          expect(rendered.getPathname()).toBe(CALENDAR_PATH);
        });
      });
    });

    describe('로그아웃 상태로 소개 화면을 열면', () => {
      it('[기록 시작하기]가 보여야 한다', async () => {
        await renderApp(null, INTRO_PATH);

        expect(screen.getAllByText(START_LABEL)).toHaveLength(2);
      });

      it('[예시 둘러보기]가 보여야 한다', async () => {
        await renderApp(null, INTRO_PATH);

        expect(screen.getAllByText(DEMO_LABEL)).toHaveLength(2);
      });

      it('[내 달력으로 이동]은 보이지 않아야 한다', async () => {
        await renderApp(null, INTRO_PATH);

        expect(screen.queryAllByText(MY_CALENDAR_LABEL)).toHaveLength(0);
      });
    });

    describe('로그인 상태로 소개 화면을 열면', () => {
      it('[내 달력으로 이동]이 보여야 한다', async () => {
        await renderApp(GOOGLE_TOKEN, INTRO_PATH);

        expect(screen.getAllByText(MY_CALENDAR_LABEL)).toHaveLength(2);
      });

      it('[기록 시작하기]는 보이지 않아야 한다', async () => {
        await renderApp(GOOGLE_TOKEN, INTRO_PATH);

        expect(screen.queryAllByText(START_LABEL)).toHaveLength(0);
      });

      it('[예시 둘러보기]는 보이지 않아야 한다', async () => {
        await renderApp(GOOGLE_TOKEN, INTRO_PATH);

        expect(screen.queryAllByText(DEMO_LABEL)).toHaveLength(0);
      });
    });

    describe('로그아웃 상태 로그인 화면에서', () => {
      describe('「서비스 소개 보기」를 누르면', () => {
        it('소개 화면으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderApp(null, SIGN_IN_PATH);
          await rendered;

          await user.press(screen.getByText(INTRO_LINK_LABEL));

          expect(rendered.getPathname()).toBe(INTRO_PATH);
        });

        it('되돌아갈 화면이 없어야 한다', async () => {
          const user = userEvent.setup();
          await renderApp(null, SIGN_IN_PATH);

          await user.press(screen.getByText(INTRO_LINK_LABEL));

          expect(router.canGoBack()).toBe(false);
        });
      });
    });

    describe('게스트의 Google 계정 연결 화면에서', () => {
      it('「서비스 소개 보기」는 보이지 않아야 한다', async () => {
        await renderApp(GUEST_TOKEN, SIGN_IN_PATH);

        expect(screen.queryByText(INTRO_LINK_LABEL)).not.toBeOnTheScreen();
      });

      describe('달력에서 열고 [내 달력으로 이동]을 누르면', () => {
        it('달력으로 가야 한다', async () => {
          const rendered = renderApp(GUEST_TOKEN, CALENDAR_PATH);
          await rendered;

          await leaveGuestConnectToCalendar();

          expect(rendered.getPathname()).toBe(CALENDAR_PATH);
        });

        it('되돌아갈 화면이 없어야 한다', async () => {
          await renderApp(GUEST_TOKEN, CALENDAR_PATH);

          await leaveGuestConnectToCalendar();

          expect(router.canGoBack()).toBe(false);
        });
      });
    });

    describe('소개에서 [예시 둘러보기]로 예시에 들어가면', () => {
      describe('상단 안내의 [기록 시작하기]를 누르면', () => {
        it('로그인 화면으로 가야 한다', async () => {
          const rendered = renderApp(null, INTRO_PATH);
          await rendered;

          await startRecordingThroughDemo();

          expect(rendered.getPathname()).toBe(SIGN_IN_PATH);
        });

        it('되돌아갈 화면이 없어야 한다', async () => {
          await renderApp(null, INTRO_PATH);

          await startRecordingThroughDemo();

          expect(router.canGoBack()).toBe(false);
        });

        it('「서비스 소개 보기」를 누르면 소개 화면으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderApp(null, INTRO_PATH);
          await rendered;
          await startRecordingThroughDemo();

          await user.press(screen.getByText(INTRO_LINK_LABEL));

          expect(rendered.getPathname()).toBe(INTRO_PATH);
        });

        it('로그인 상태가 되면 달력으로 가야 한다', async () => {
          const rendered = renderApp(null, INTRO_PATH);
          await rendered;
          await startRecordingThroughDemo();

          await act(() => changeToken(GOOGLE_TOKEN));

          expect(rendered.getPathname()).toBe(CALENDAR_PATH);
        });
      });
    });

    describe('예시 메뉴의 「서비스 소개」로 소개에 오면', () => {
      describe('[기록 시작하기]로 로그인 화면을 열고', () => {
        it('로그인 상태가 되면 달력으로 가야 한다', async () => {
          const user = userEvent.setup();
          const rendered = renderApp(null, DEMO_HOME_URL);
          await rendered;
          await user.press(screen.getByTestId(MENU_BUTTON_TEST_ID));
          await user.press(screen.getByText(DEMO_MENU_INTRO_LABEL));
          const [heroStartButton] = screen.getAllByText(START_LABEL);
          await user.press(heroStartButton);

          await act(() => changeToken(GOOGLE_TOKEN));

          expect(rendered.getPathname()).toBe(CALENDAR_PATH);
        });
      });
    });
  });

  describe('Edge cases', () => {
    describe('게스트가 달력에 있다가 로그아웃 상태가 되어', () => {
      describe('로그인 실패 화면으로 가면', () => {
        it('로그인 화면에 남아야 한다', async () => {
          const rendered = renderApp(GUEST_TOKEN, CALENDAR_PATH);
          await rendered;

          await leaveToFailedSignIn();

          expect(rendered.getPathname()).toBe(SIGN_IN_PATH);
        });

        it('로그인 실패 안내가 보여야 한다', async () => {
          await renderApp(GUEST_TOKEN, CALENDAR_PATH);

          await leaveToFailedSignIn();

          expect(screen.getByText(LOGIN_FAILED_TITLE)).toBeOnTheScreen();
        });
      });
    });
  });
});

const START_LABEL = '기록 시작하기';
const DEMO_LABEL = '예시 둘러보기';
const MY_CALENDAR_LABEL = '내 달력으로 이동';
const LOGIN_FAILED_TITLE = '로그인하지 못했어요';
const INTRO_LINK_LABEL = '서비스 소개 보기';
const DEMO_MENU_INTRO_LABEL = '서비스 소개';
const INTRO_PATH = '/intro';
const SIGN_IN_PATH = '/sign-in';
const {year: CURRENT_YEAR, month: CURRENT_MONTH_INDEX} = getKoreanDate();
const CURRENT_MONTH = {year: CURRENT_YEAR, month: CURRENT_MONTH_INDEX + 1};
const CALENDAR_PATH = monthPath(CURRENT_MONTH);
const GOOGLE_TOKEN = createToken({sub: 'user-1', isGuest: false});
const GUEST_TOKEN = createToken({sub: 'user-1', isGuest: true});

let changeToken: (token: string | null) => void;

function createToken(payload: object) {
  return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
}

function leaveToFailedSignIn() {
  const href = getConnectOutcomeHref('failed');

  return act(() => {
    changeToken(null);
    if (href !== null) {
      router.push(href);
    }
  });
}

async function leaveGuestConnectToCalendar() {
  const user = userEvent.setup();
  await act(() => router.push(SIGN_IN_PATH));
  await user.press(screen.getByText(MY_CALENDAR_LABEL));
}

async function startRecordingThroughDemo() {
  const user = userEvent.setup();
  const [heroDemoButton] = screen.getAllByText(DEMO_LABEL);
  await user.press(heroDemoButton);
  /* 소개 화면이 스택 아래에 그대로 그려져 있어 띠의 버튼은 맨 뒤에 잡힌다 */
  const startButtons = screen.getAllByText(START_LABEL);
  await user.press(startButtons[startButtons.length - 1]);
}

function renderApp(initialToken: string | null, initialUrl?: string) {
  return renderRouter(
    {
      /* expo-router 파일 이름(`_layout`)이 레포 이름 규칙에 걸려 계산된 키로 적는다 */
      ['_layout']: () => <GuardedLayout initialToken={initialToken} />,
      index: HomeScreen,
      'study-records/[year]/[month]': EmptyScreen,
      'study-record-stats/[year]/[month]': EmptyScreen,
      account: EmptyScreen,
      intro: IntroScreen,
      'sign-in': SignInScreen,
      'demo/study-records/index': DemoEntryScreen,
      'demo/study-records/[year]/[month]': DemoCalendarScreen,
      'demo/study-record-stats/[year]/[month]': EmptyScreen,
    },
    {initialUrl},
  );
}

function GuardedLayout({initialToken}: GuardedLayoutProps) {
  const [token, setToken] = useState(initialToken);

  useEffect(() => {
    changeToken = setToken;
  }, []);

  return (
    <TestSessionProvider token={token}>
      <RootNavigator />
    </TestSessionProvider>
  );
}

function DemoEntryScreen() {
  return <Redirect href={demoCalendarPath(CURRENT_MONTH)} />;
}

function DemoCalendarScreen() {
  return (
    <>
      <DemoBanner />
      <DemoCalendarMenu />
    </>
  );
}

function HomeScreen() {
  return <Redirect href={CALENDAR_PATH} />;
}

function EmptyScreen() {
  return null;
}
