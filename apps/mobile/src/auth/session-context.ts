import {createContext, useContext} from 'react';

export type GoogleConnectResult = 'connected' | 'cancelled' | 'rejected' | 'rejection-expired';

export interface SessionContextValue {
  session: {
    /** 앱 토큰. null이면 로그인하지 않았다 */
    token: string | null;
    isLoading: boolean;
    isGuest: boolean;
  };
  handlers: {
    signIn: () => Promise<void>;
    startAsGuest: () => Promise<void>;
    connectGoogle: () => Promise<GoogleConnectResult>;
    discardGuestAndConnect: () => Promise<GoogleConnectResult>;
    signOut: () => Promise<void>;
  };
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (value === null) {
    throw new Error('useSession은 SessionProvider 안에서만 쓸 수 있다');
  }
  return value;
}
