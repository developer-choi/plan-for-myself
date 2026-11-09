import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import {type ErrorBoundaryProps} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {OverlayProvider} from 'overlay-kit';
import {ENTRY_LABEL, getErrorInfo, RETRY_LABEL} from '@plan-for-myself/shared';
import SessionProvider from '@/auth/components/SessionProvider';
import AppToaster from '@/shared/components/AppToaster';
import ErrorNotice from '@/shared/components/ErrorNotice';
import QueryProvider from '@/shared/components/QueryProvider';
import RootNavigator from '@/shared/components/RootNavigator';
import useReportPageError from '@/shared/error/useReportPageError';
import {sentryInitOptions} from '@/shared/sentry/init-options';

export default Sentry.wrap(RootLayout);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="auto" />
      <SessionProvider>
        <QueryProvider>
          <OverlayProvider>
            <RootNavigator />
            <AppToaster />
          </OverlayProvider>
        </QueryProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}

export function ErrorBoundary({error, retry}: ErrorBoundaryProps) {
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return (
    <ErrorNotice
      action={{label: RETRY_LABEL, onPress: retry}}
      content={content}
      link={{href: '/', label: ENTRY_LABEL}}
      title={title}
    />
  );
}

Sentry.init(sentryInitOptions);
/* 저장한 세션을 다 읽기 전에 로그인 화면이 잠깐 보이지 않게 한다 */
SplashScreen.preventAutoHideAsync();
