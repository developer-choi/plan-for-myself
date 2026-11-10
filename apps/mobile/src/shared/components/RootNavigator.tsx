import {useEffect} from 'react';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {overlay} from 'overlay-kit';
import {useSession} from '@/auth/session-context';

export default function RootNavigator() {
  const {
    session: {token, isLoading, isGuest},
  } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  useEffect(() => {
    if (token === null) {
      overlay.unmountAll();
    }
  }, [token]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Protected guard={token !== null}>
        <Stack.Screen name="index" />
        <Stack.Screen name="study-records/[year]/[month]" />
        <Stack.Screen name="study-record-stats/[year]/[month]" />
        <Stack.Screen name="account" />
      </Stack.Protected>
      <Stack.Screen name="intro" />
      <Stack.Protected guard={token === null || isGuest}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Screen name="demo/study-records/index" />
      <Stack.Screen name="demo/study-records/[year]/[month]" />
      <Stack.Screen name="demo/study-record-stats/[year]/[month]" />
    </Stack>
  );
}
