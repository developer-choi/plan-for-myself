'use client';

import type {DemoChoiceReason} from '@plan-for-myself/shared';
import {openDemoChoiceDialog} from '@plan-for-myself/shared/react';
import {useSession} from 'next-auth/react';
import {getLoginState} from '@/auth/path';
import LoggedInDemoChoiceDialog from '@/demo/components/LoggedInDemoChoiceDialog';
import LoggedOutDemoChoiceDialog from '@/demo/components/LoggedOutDemoChoiceDialog';

export function useOpenDemoChoiceDialog(reason: DemoChoiceReason) {
  const {data: session} = useSession();
  const isLoggedIn = getLoginState(session) !== 'logged-out';

  return () => {
    openDemoChoiceDialog({
      reason,
      isLoggedIn,
      dialogs: {loggedIn: LoggedInDemoChoiceDialog, loggedOut: LoggedOutDemoChoiceDialog},
    });
  };
}
