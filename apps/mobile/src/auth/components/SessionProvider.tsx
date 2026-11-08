import {type PropsWithChildren, useCallback, useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from 'react-native-nitro-google-signin';
import {SessionContext} from '@/auth/session-context';

export default function SessionProvider({children}: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setToken(await SecureStore.getItemAsync(ID_TOKEN_KEY));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async () => {
    const idToken = await requestGoogleIdToken();
    if (idToken === null) {
      return;
    }
    await SecureStore.setItemAsync(ID_TOKEN_KEY, idToken);
    setToken(idToken);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
    } finally {
      setToken(null);
    }
    await GoogleOneTapSignIn.signOut();
  }, []);

  return <SessionContext value={{session: {token, isLoading}, handlers: {signIn, signOut}}}>{children}</SessionContext>;
}

/* 웹(Auth.js)이 쓰는 구글 웹 클라이언트 ID. ID 토큰의 aud가 이 값이 된다 */
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const ID_TOKEN_KEY = 'idToken';

async function requestGoogleIdToken(): Promise<string | null> {
  await GoogleOneTapSignIn.checkPlayServices();
  const savedResponse = await GoogleOneTapSignIn.signIn();
  const response = isNoSavedCredentialFoundResponse(savedResponse)
    ? await GoogleOneTapSignIn.createAccount()
    : savedResponse;

  if (isCancelledResponse(response)) {
    return null;
  }
  if (!isSuccessResponse(response)) {
    throw new Error(`로그인 안 됨: ${response.type}`);
  }
  return response.data.idToken;
}

GoogleOneTapSignIn.configure({webClientId: WEB_CLIENT_ID, autoSelectOnSignIn: true});
