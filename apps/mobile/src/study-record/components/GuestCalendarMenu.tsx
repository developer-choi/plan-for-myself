import {openURL} from 'expo-linking';
import {router} from 'expo-router';
import {ACCOUNT_LABEL, PRIVACY_POLICY_LABEL} from '@plan-for-myself/shared';
import HeaderMenu from '@/shared/components/HeaderMenu';
import {PRIVACY_POLICY_URL} from '@/shared/external-link';

export default function GuestCalendarMenu() {
  return (
    <HeaderMenu
      items={[
        {label: ACCOUNT_LABEL, onPress: () => router.push('/account')},
        {label: PRIVACY_POLICY_LABEL, onPress: () => void openURL(PRIVACY_POLICY_URL)},
      ]}
    />
  );
}
