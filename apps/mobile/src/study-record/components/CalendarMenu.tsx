import {LOGOUT_LABEL} from '@plan-for-myself/shared';
import {useHandleClientSideError} from '@plan-for-myself/shared/react';
import {useSession} from '@/auth/session-context';
import HeaderMenu from '@/shared/components/HeaderMenu';
import Alert from '@/shared/components/Alert';

export default function CalendarMenu() {
  const {
    handlers: {signOut},
  } = useSession();
  const handleClientSideError = useHandleClientSideError(Alert);

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      handleClientSideError(error);
    }
  };

  return <HeaderMenu items={[{label: LOGOUT_LABEL, onPress: () => void logout()}]} />;
}
