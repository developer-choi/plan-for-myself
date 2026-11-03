import {openURL} from 'expo-linking';
import {router} from 'expo-router';
import {ACCOUNT_LABEL, LOGOUT_LABEL, PRIVACY_POLICY_LABEL} from '@plan-for-myself/shared';
import {useHandleClientSideError} from '@plan-for-myself/shared/react';
import {useSession} from '@/auth/session-context';
import HeaderMenu from '@/shared/components/HeaderMenu';
import Alert from '@/shared/components/Alert';
import {PRIVACY_POLICY_URL} from '@/shared/external-link';

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

  return (
    <HeaderMenu
      items={[
        {label: ACCOUNT_LABEL, onPress: () => router.push('/account')},
        {label: PRIVACY_POLICY_LABEL, onPress: () => void openURL(PRIVACY_POLICY_URL)},
        {label: LOGOUT_LABEL, onPress: () => void logout()},
      ]}
    />
  );
}
