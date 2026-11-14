import {useEffect, useState} from 'react';
import {renderRouter, screen} from 'expo-router/testing-library';
import {act} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import IntroScreen from '@/app/intro';
import SignInScreen from '@/app/sign-in';
import {TestSessionProvider} from '@/auth/test-utils';
import RootNavigator from '@/shared/components/RootNavigator';

interface TestSession {
  token: string | null;
  isSignedOutByServer: boolean;
}

describe('서버 401 로그아웃 뒤 화면', () => {
  describe('General cases', () => {
    describe('달력에서 서버 401로 로그아웃되면', () => {
      it('로그인 화면으로 가야 한다', async () => {
        const rendered = renderApp({token: GOOGLE_TOKEN, isSignedOutByServer: false}, CALENDAR_PATH);
        await rendered;

        await act(() => changeSession({token: null, isSignedOutByServer: true}));

        expect(rendered.getPathname()).toBe(SIGN_IN_PATH);
      });

      it('로그인이 풀렸다는 안내가 보여야 한다', async () => {
        await renderApp({token: GOOGLE_TOKEN, isSignedOutByServer: false}, CALENDAR_PATH);

        await act(() => changeSession({token: null, isSignedOutByServer: true}));

        expect(screen.getByText(SIGNED_OUT_TITLE)).toBeOnTheScreen();
      });
    });

    describe('달력에서 직접 로그아웃하면', () => {
      it('소개 화면으로 가야 한다', async () => {
        const rendered = renderApp({token: GOOGLE_TOKEN, isSignedOutByServer: false}, CALENDAR_PATH);
        await rendered;

        await act(() => changeSession({token: null, isSignedOutByServer: false}));

        expect(rendered.getPathname()).toBe(INTRO_PATH);
      });
    });
  });

  describe('Edge cases', () => {
    describe('게스트가 Google 연결 화면을 연 채 서버 401로 로그아웃되면', () => {
      it('로그인이 풀렸다는 안내가 보여야 한다', async () => {
        await renderApp({token: GUEST_TOKEN, isSignedOutByServer: false}, SIGN_IN_PATH);

        await act(() => changeSession({token: null, isSignedOutByServer: true}));

        expect(screen.getByText(SIGNED_OUT_TITLE)).toBeOnTheScreen();
      });
    });
  });
});

const SIGNED_OUT_TITLE = '로그인이 풀렸어요';
const INTRO_PATH = '/intro';
const SIGN_IN_PATH = '/sign-in';
const CALENDAR_PATH = '/study-records/2026/11';
const GOOGLE_TOKEN = createToken({sub: 'user-1', isGuest: false});
const GUEST_TOKEN = createToken({sub: 'user-1', isGuest: true});

let changeSession: (session: TestSession) => void = () => {};

function renderApp(initialSession: TestSession, initialUrl: string) {
  return renderRouter(
    {
      ['_layout']: () => <SessionLayout initialSession={initialSession} />,
      index: EmptyScreen,
      'study-records/[year]/[month]': EmptyScreen,
      'study-record-stats/[year]/[month]': EmptyScreen,
      account: EmptyScreen,
      intro: IntroScreen,
      'sign-in': SignInScreen,
      'demo/study-records/index': EmptyScreen,
      'demo/study-records/[year]/[month]': EmptyScreen,
      'demo/study-record-stats/[year]/[month]': EmptyScreen,
    },
    {initialUrl},
  );
}

function SessionLayout({initialSession}: {initialSession: TestSession}) {
  const [session, setSession] = useState(initialSession);

  useEffect(() => {
    changeSession = setSession;
  }, []);

  return (
    <TestSessionProvider isSignedOutByServer={session.isSignedOutByServer} token={session.token}>
      <RootNavigator />
    </TestSessionProvider>
  );
}

function EmptyScreen() {
  return null;
}

function createToken(payload: object) {
  return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
}
