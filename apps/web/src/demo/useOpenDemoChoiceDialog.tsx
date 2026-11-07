'use client';

import {useSession} from 'next-auth/react';
import {openOnce} from '@plan-for-myself/shared/react';
import {getLoginState} from '@/auth/path';
import LoggedInDemoChoiceDialog from '@/demo/components/LoggedInDemoChoiceDialog';
import LoggedOutDemoChoiceDialog from '@/demo/components/LoggedOutDemoChoiceDialog';
import type {DemoChoiceReason} from '@/demo/demo-choice-reason';

export function useOpenDemoChoiceDialog(reason: DemoChoiceReason) {
  const {data: session} = useSession();
  const ChoiceDialog = getLoginState(session) === 'logged-out' ? LoggedOutDemoChoiceDialog : LoggedInDemoChoiceDialog;

  return () => {
    openOnce('demo-choice', ({isOpen, unmount}) => <ChoiceDialog isOpen={isOpen} reason={reason} onClose={unmount} />);
  };
}
