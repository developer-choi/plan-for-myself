import {openURL} from 'expo-linking';
import {MY_CALENDAR_LABEL, PRIVACY_POLICY_LABEL} from '@plan-for-myself/shared';
import {useSession} from '@/auth/session-context';
import HeaderMenu from '@/shared/components/HeaderMenu';
import {PRIVACY_POLICY_URL} from '@/shared/external-link';
import {resetStackTo} from '@/shared/reset-stack';

export default function DemoCalendarMenu() {
  const {session} = useSession();
  const isLoggedIn = session.token !== null;

  return (
    <HeaderMenu
      items={[
        ...(isLoggedIn ? [{label: MY_CALENDAR_LABEL, onPress: () => resetStackTo('/')}] : []),
        {label: PRIVACY_POLICY_LABEL, onPress: () => void openURL(PRIVACY_POLICY_URL)},
      ]}
    />
  );
}
