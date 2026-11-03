import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {readIsGuest} from '@/auth/read-app-token';
import {SessionContext} from '@/auth/session-context';
import AccountSection from './AccountSection';

describe('AccountSection', () => {
  describe('General cases', () => {
    describe('게스트로 이용 중이면', () => {
      it('게스트 안내가 보여야 한다', async () => {
        await renderSection(GUEST_TOKEN);

        expect(screen.getByText(GUEST_TITLE)).toBeOnTheScreen();
      });

      it('연결 버튼이 보여야 한다', async () => {
        await renderSection(GUEST_TOKEN);

        expect(screen.getByText(CONNECT_LABEL)).toBeOnTheScreen();
      });

      it('Google 안내가 없어야 한다', async () => {
        await renderSection(GUEST_TOKEN);

        expect(screen.queryByText(GOOGLE_TITLE)).not.toBeOnTheScreen();
      });
    });

    describe('Google 계정으로 로그인 중이면', () => {
      it('Google 안내가 보여야 한다', async () => {
        await renderSection(GOOGLE_TOKEN);

        expect(screen.getByText(GOOGLE_TITLE)).toBeOnTheScreen();
      });

      it('게스트 안내가 없어야 한다', async () => {
        await renderSection(GOOGLE_TOKEN);

        expect(screen.queryByText(GUEST_TITLE)).not.toBeOnTheScreen();
      });

      it('연결 버튼이 없어야 한다', async () => {
        await renderSection(GOOGLE_TOKEN);

        expect(screen.queryByText(CONNECT_LABEL)).not.toBeOnTheScreen();
      });
    });
  });
});

const GUEST_TITLE = '게스트 계정으로 이용 중';
const GOOGLE_TITLE = 'Google 계정으로 로그인 중';
const CONNECT_LABEL = 'Google 계정 연결하기';
const GUEST_TOKEN = createToken({sub: 'user-1', isGuest: true});
const GOOGLE_TOKEN = createToken({sub: 'user-1', isGuest: false});

function createToken(payload: object) {
  return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
}

const failUnused = () => {
  throw new Error('이 테스트는 세션 핸들러를 부르지 않는다');
};

const UNUSED_HANDLERS = {
  signIn: failUnused,
  startAsGuest: failUnused,
  connectGoogle: failUnused,
  discardGuestAndConnect: failUnused,
  signOut: failUnused,
};

function renderSection(token: string) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <SessionContext.Provider
        value={{session: {token, isLoading: false, isGuest: readIsGuest(token)}, handlers: UNUSED_HANDLERS}}
      >
        <AccountSection />
      </SessionContext.Provider>
    </QueryClientProvider>,
  );
}
