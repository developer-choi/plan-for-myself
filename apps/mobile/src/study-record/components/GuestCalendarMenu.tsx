import {openURL} from 'expo-linking';
import {router} from 'expo-router';
import {
  ACCOUNT_LABEL,
  DEMO_HOME_URL,
  DEMO_TOUR_LABEL,
  INTRO_MENU_LABEL,
  INTRO_URL,
  PRIVACY_POLICY_LABEL,
} from '@plan-for-myself/shared';
import HeaderMenu from '@/shared/components/HeaderMenu';
import {PRIVACY_POLICY_URL} from '@/shared/external-link';

export default function GuestCalendarMenu() {
  return (
    <HeaderMenu
      items={[
        {label: ACCOUNT_LABEL, onPress: () => router.push('/account')},
        {label: INTRO_MENU_LABEL, onPress: () => router.push(INTRO_URL)},
        {label: DEMO_TOUR_LABEL, onPress: () => router.push(DEMO_HOME_URL)},
        {label: PRIVACY_POLICY_LABEL, onPress: () => void openURL(PRIVACY_POLICY_URL)},
      ]}
    />
  );
}
