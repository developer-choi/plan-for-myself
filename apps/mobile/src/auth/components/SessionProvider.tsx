import {type PropsWithChildren, useCallback, useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import {captureException} from '@sentry/react-native';
import {isUnauthorizedError} from '@plan-for-myself/shared/error';
import type {RegisteredAccountRejection} from '@plan-for-myself/shared/auth';
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from 'react-native-nitro-google-signin';
import {postAppTokenApi, postAppTokenGuestApi, postAppTokenRefreshApi} from '@/auth/api';
import {deleteAppToken, getAppToken, saveAppToken} from '@/auth/app-token-storage';
import {readIsGuest} from '@/auth/read-app-token';
import {clearRegisteredRejection, readRegisteredRejection, saveRegisteredRejection} from '@/auth/registered-rejection';
import {type GoogleConnectResult, SessionContext} from '@/auth/session-context';
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

  const commitToken = useCallback(async (next: string) => {
    await saveAppToken(next);
    setToken(next);
  }, []);

  const signIn = useCallback(async () => {
    const idToken = await requestGoogleIdToken();
    if (idToken === null) {
      return;
    }
    const exchange = await postAppTokenApi({idToken, discardIntent: null});
    if (exchange.type === 'registered-account') {
      throw new Error('게스트 토큰 없이 보낸 교환이 이미 가입됨으로 거절됐다');
    }
    await commitToken(exchange.token);
  }, [commitToken]);

  const exchangeForConnect = useCallback(
    async (discardIntent: RegisteredAccountRejection | null): Promise<GoogleConnectResult> => {
      const idToken = await requestGoogleIdToken();
      if (idToken === null) {
        return 'cancelled';
      }

      const exchange = await postAppTokenApi({idToken, discardIntent});
      if (exchange.type === 'registered-account') {
        saveRegisteredRejection(exchange.rejection);
        return 'rejected';
      }

      await commitToken(exchange.token);
      clearRegisteredRejection();
      return 'connected';
    },
    [commitToken],
  );

  const connectGoogle = useCallback(() => exchangeForConnect(null), [exchangeForConnect]);

  const discardGuestAndConnect = useCallback(async (): Promise<GoogleConnectResult> => {
    const discardIntent = readRegisteredRejection();
    if (discardIntent === null) {
      clearRegisteredRejection();
      return 'rejection-expired';
    }
    return exchangeForConnect(discardIntent);
  }, [exchangeForConnect]);

  const startAsGuest = useCallback(async () => {
    const {token: next} = await requestGuestToken();
    await commitToken(next);
  }, [commitToken]);

  const signOut = useCallback(async () => {
    clearRegisteredRejection();
    try {
      await deleteAppToken();
    } finally {
      setToken(null);
    }
    await GoogleOneTapSignIn.signOut();
  }, []);

  useAppTokenRefresh({isLoading, updateToken: setToken, signOut});

  return (
    <SessionContext
      value={{
        session: {token, isLoading, isGuest: readIsGuest(token)},
        handlers: {signIn, startAsGuest, connectGoogle, discardGuestAndConnect, signOut},
      }}
    >
      {children}
    </SessionContext>
  );
}

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const REFRESH_TIMEOUT_MILLISECONDS = 10_000;
const GUEST_START_TIMEOUT_MILLISECONDS = 10_000;

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
      const sent = await getAppToken();
      if (sent === null) {
        return;
      }
      const next = await requestRefreshedToken();
      if (next === null) {
        return;
      }
      /* 기다리는 사이 Google 연결·로그아웃으로 토큰이 바뀌었으면, 서버가 옛 토큰 claim을 복사한 응답이 새 토큰을 덮어쓴다 */
      if ((await getAppToken()) !== sent) {
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
      refresh().catch(captureException);
    }
  }, [isLoading, refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        refresh().catch(captureException);
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

async function requestGuestToken() {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), GUEST_START_TIMEOUT_MILLISECONDS);
  try {
    return await postAppTokenGuestApi(abortController.signal);
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
