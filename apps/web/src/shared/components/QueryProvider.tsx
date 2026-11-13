'use client';

import {type PropsWithChildren, useState} from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {createQueryClient} from '@plan-for-myself/shared/query';
import {toLoginUrl} from '@/auth/redirect';
import {signOutAndReplace} from '@/auth/sign-out';

export default function QueryProvider({children}: PropsWithChildren) {
  const [queryClient] = useState(createWebQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function createWebQueryClient() {
  let isSigningOut = false;

  /* /login으로 옮기기만 하면 탈퇴한 사용자의 쿠키는 그대로 풀려 로그인 상태로 보이고 소개로 튕기므로, 쿠키를 지우고 보낸다 */
  return createQueryClient(() => {
    if (isSigningOut) {
      return;
    }

    isSigningOut = true;
    signOutAndReplace(toLoginUrl(window.location.pathname + window.location.search));
  });
}
