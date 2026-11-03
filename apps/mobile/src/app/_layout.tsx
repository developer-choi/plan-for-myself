import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import SessionProvider from '@/auth/components/SessionProvider';
import QueryProvider from '@/shared/components/QueryProvider';
import RootNavigator from '@/shared/components/RootNavigator';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <SessionProvider>
        <QueryProvider>
          <RootNavigator />
        </QueryProvider>
      </SessionProvider>
    </>
  );
}

/* 저장한 세션을 다 읽기 전에 로그인 화면이 잠깐 보이지 않게 한다 */
SplashScreen.preventAutoHideAsync();
