import {useEffect} from 'react';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useSession} from '@/auth/session-context';

export default function RootNavigator() {
  const {
    session: {token, isLoading},
  } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Protected guard={token !== null}>
        <Stack.Screen name="index" />
        <Stack.Screen name="study-records/[year]/[month]" />
      </Stack.Protected>
      <Stack.Protected guard={token === null}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
