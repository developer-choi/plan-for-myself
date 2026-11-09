import {INTRO_MENU_LABEL, MY_CALENDAR_LABEL, PRIVACY_POLICY_LABEL} from '@plan-for-myself/shared/label';
import {INTRO_URL} from '@plan-for-myself/shared/intro';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import HeaderMenu from '@/shared/components/HeaderMenu';

interface DemoCalendarMenuProps {
  isLoggedIn: boolean;
}

export default function DemoCalendarMenu({isLoggedIn}: DemoCalendarMenuProps) {
  return (
    <HeaderMenu
      items={[
        ...(isLoggedIn ? [{label: MY_CALENDAR_LABEL, href: DEFAULT_HOME_URL}] : []),
        {label: INTRO_MENU_LABEL, href: INTRO_URL},
        {label: PRIVACY_POLICY_LABEL, href: '/privacy'},
      ]}
    />
  );
}
