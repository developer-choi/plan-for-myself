import type {ReactNode} from 'react';
import {readIsGuest} from '@/auth/read-app-token';
import {SessionContext} from '@/auth/session-context';

interface TestSessionProviderProps {
  token: string | null;
  isSignedOutByServer?: boolean;
  children: ReactNode;
}

export function TestSessionProvider({token, isSignedOutByServer = false, children}: TestSessionProviderProps) {
  return (
    <SessionContext.Provider
      value={{
        session: {token, isLoading: false, isGuest: readIsGuest(token), isSignedOutByServer},
        handlers: UNUSED_HANDLERS,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
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
  signOutOnUnauthorized: failUnused,
};
