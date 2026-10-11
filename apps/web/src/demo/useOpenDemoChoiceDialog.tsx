'use client';

import {useSession} from 'next-auth/react';
import {overlay} from 'overlay-kit';
import {getLoginState} from '@/auth/path';
import LoggedInDemoChoiceDialog from '@/demo/components/LoggedInDemoChoiceDialog';
import LoggedOutDemoChoiceDialog from '@/demo/components/LoggedOutDemoChoiceDialog';

export function useOpenDemoChoiceDialog() {
  const {data: session} = useSession();
  const ChoiceDialog = getLoginState(session) === 'logged-out' ? LoggedOutDemoChoiceDialog : LoggedInDemoChoiceDialog;

  return () => {
    overlay.open(({isOpen, unmount}) => <ChoiceDialog isOpen={isOpen} onClose={unmount} />);
  };
}
