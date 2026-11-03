import {type PropsWithChildren, useCallback, useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import {isUnauthorizedError} from '@plan-for-myself/shared';
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from 'react-native-nitro-google-signin';
import {postAppTokenApi, postAppTokenRefreshApi} from '@/auth/api';
import {deleteAppToken, getAppToken, saveAppToken} from '@/auth/app-token-storage';
import {SessionContext} from '@/auth/session-context';
import {ApiResponseError} from '@developer-choi/utils/api';
import {isTransientApiError} from '@/shared/api/transient';

interface UseAppTokenRefreshParams {
  isLoading: boolean;
  updateToken: (token: string) => void;
  signOut: () => Promise<void>;
}

export default function SessionProvider({children}: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setToken(await getAppToken());
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
    const {token: next} = await postAppTokenApi({idToken});
    await saveAppToken(next);
    setToken(next);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await deleteAppToken();
    } finally {
      setToken(null);
    }
    await GoogleOneTapSignIn.signOut();
  }, []);

  useAppTokenRefresh({isLoading, updateToken: setToken, signOut});

  return <SessionContext value={{session: {token, isLoading}, handlers: {signIn, signOut}}}>{children}</SessionContext>;
}

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const REFRESH_TIMEOUT_MILLISECONDS = 10_000;

function useAppTokenRefresh({isLoading, updateToken, signOut}: UseAppTokenRefreshParams) {
  const isRefreshingCache = useRef(false);

  /**
   * @throws 401·네트워크 오류·5xx·제한 시간 초과가 아닌 실패일 때 (저장소 실패 등)
   */
  const refresh = useCallback(async () => {
    if (isRefreshingCache.current) {
      return;
    }

    isRefreshingCache.current = true;
    try {
      if ((await getAppToken()) === null) {
        return;
      }
      const next = await requestRefreshedToken();
      if (next === null) {
        return;
      }
      await saveAppToken(next);
      updateToken(next);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        await signOut();
        return;
      }
      if (!isTransientApiError(error)) {
        throw error;
      }
    } finally {
      isRefreshingCache.current = false;
    }
  }, [updateToken, signOut]);

  useEffect(() => {
    if (!isLoading) {
      void refresh();
    }
  }, [isLoading, refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        void refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);
}

/**
 * null: 제한 시간이 지나 요청을 중단했다
 * @throws 서버가 상태 코드로 답한 오류, 제한 시간과 무관한 요청 실패
 */
async function requestRefreshedToken(): Promise<string | null> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), REFRESH_TIMEOUT_MILLISECONDS);
  try {
    const response = await postAppTokenRefreshApi(abortController.signal);
    return abortController.signal.aborted ? null : response.token;
  } catch (error) {
    if (abortController.signal.aborted && !(error instanceof ApiResponseError)) {
      return null;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

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
