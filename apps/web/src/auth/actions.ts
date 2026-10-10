'use server';

import {redirect} from 'next/navigation';
import {
  clearDiscardIntent,
  readRegisteredRejection,
  setDiscardIntent,
  shouldShowRegisteredNotice,
} from '@/auth/login-cookies';
import {auth, signIn} from '@/auth/next-auth';
import {DEFAULT_HOME_URL, toRedirectPath} from '@/auth/redirect';

export async function continueWithGoogle(redirect: string | undefined): Promise<void> {
  /* 기록 삭제 버튼을 누르고 구글 화면에서 취소하면 의도 쿠키가 남는다. 지우지 않으면 이 일반 로그인에서 기록이 지워진다 */
  await clearDiscardIntent();

  await signIn('google', {redirectTo: toRedirectPath(redirect ?? null)});
}

export async function discardGuestAndContinueWithGoogle(): Promise<void> {
  const [rejection, session] = await Promise.all([readRegisteredRejection(), auth()]);

  if (!rejection || !shouldShowRegisteredNotice(rejection, session)) {
    redirect('/login');
  }

  await setDiscardIntent(rejection);
  await signIn('google', {redirectTo: DEFAULT_HOME_URL});
}
