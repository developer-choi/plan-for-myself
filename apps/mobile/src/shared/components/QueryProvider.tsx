import {type PropsWithChildren, useEffect, useState} from 'react';
import {AppState, type AppStateStatus, Platform} from 'react-native';
import {createQueryClient} from '@plan-for-myself/shared/react';
import {focusManager, QueryClientProvider} from '@tanstack/react-query';
import {useSession} from '@/auth/session-context';

export default function QueryProvider({children}: PropsWithChildren) {
  const {
    session: {token},
    handlers: {signOut},
  } = useSession();
  const [queryClient] = useState(() => createQueryClient(() => void signOut()));

  /* 로그아웃하면 이전 사용자의 데이터가 다음 로그인 화면 뒤에 남지 않게 지운다 */
  useEffect(() => {
    if (token === null) {
      queryClient.removeQueries();
    }
  }, [queryClient, token]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}
