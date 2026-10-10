'use client';

import {type PropsWithChildren, useState} from 'react';
import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ApiResponseError} from '@developer-choi/utils/api';
import {toLoginUrl} from '@/auth/redirect';
import {signOutAndReplace} from '@/auth/sign-out';

export default function QueryProvider({children}: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const STALE_TIME_MS = 60_000;

const UNAUTHORIZED_STATUS = 401;

function createQueryClient() {
  let isSigningOut = false;

  /* /login으로 옮기기만 하면 탈퇴한 사용자의 쿠키는 그대로 풀려 로그인 상태로 보이고 소개로 튕기므로, 쿠키를 지우고 보낸다 */
  function signOutWhenUnauthorized(error: Error) {
    if (!(error instanceof ApiResponseError) || error.status !== UNAUTHORIZED_STATUS || isSigningOut) {
      return;
    }

    isSigningOut = true;
    signOutAndReplace(toLoginUrl(window.location.pathname + window.location.search));
  }

  return new QueryClient({
    queryCache: new QueryCache({onError: signOutWhenUnauthorized}),
    mutationCache: new MutationCache({onError: signOutWhenUnauthorized}),
    defaultOptions: {queries: {retry: 0, staleTime: STALE_TIME_MS}},
  });
}
