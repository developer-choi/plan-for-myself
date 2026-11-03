import type {DemoChoiceReason} from '@plan-for-myself/shared';
import {openDemoChoiceDialog} from '@plan-for-myself/shared/react';
import {useSession} from '@/auth/session-context';
import LoggedInDemoChoiceDialog from '@/demo/components/LoggedInDemoChoiceDialog';
import LoggedOutDemoChoiceDialog from '@/demo/components/LoggedOutDemoChoiceDialog';

export default function useOpenDemoChoiceDialog(reason: DemoChoiceReason) {
  const {session} = useSession();
  const isLoggedIn = session.token !== null;

  return () => {
    openDemoChoiceDialog({
      reason,
      isLoggedIn,
      dialogs: {loggedIn: LoggedInDemoChoiceDialog, loggedOut: LoggedOutDemoChoiceDialog},
    });
  };
}
