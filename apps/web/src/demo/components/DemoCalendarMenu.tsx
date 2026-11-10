import {MY_CALENDAR_LABEL, PRIVACY_POLICY_LABEL} from '@plan-for-myself/shared';
import {DEFAULT_HOME_URL, INTRO_URL} from '@/auth/redirect';
import HeaderMenu from '@/shared/components/HeaderMenu';

interface DemoCalendarMenuProps {
  isLoggedIn: boolean;
}

export default function DemoCalendarMenu({isLoggedIn}: DemoCalendarMenuProps) {
  return (
    <HeaderMenu
      items={[
        ...(isLoggedIn ? [{label: MY_CALENDAR_LABEL, href: DEFAULT_HOME_URL}] : []),
        {label: '서비스 소개', href: INTRO_URL},
        {label: PRIVACY_POLICY_LABEL, href: '/privacy'},
      ]}
    />
  );
}
