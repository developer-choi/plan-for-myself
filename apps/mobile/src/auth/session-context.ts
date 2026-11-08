import {createContext, useContext} from 'react';

export interface SessionContextValue {
  session: {
    /** 구글 ID 토큰. null이면 로그인하지 않았다 */
    token: string | null;
    isLoading: boolean;
  };
  handlers: {
    signIn: () => Promise<void>;
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
