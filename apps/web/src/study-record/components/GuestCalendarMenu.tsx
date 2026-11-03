import {
  ACCOUNT_LABEL,
  DEMO_HOME_URL,
  DEMO_TOUR_LABEL,
  INTRO_MENU_LABEL,
  INTRO_URL,
  PRIVACY_POLICY_LABEL,
} from '@plan-for-myself/shared';
import HeaderMenu from '@/shared/components/HeaderMenu';

export default function GuestCalendarMenu() {
  return (
    <HeaderMenu
      items={[
        {label: ACCOUNT_LABEL, href: '/account'},
        {label: INTRO_MENU_LABEL, href: INTRO_URL},
        {label: DEMO_TOUR_LABEL, href: DEMO_HOME_URL},
        {label: PRIVACY_POLICY_LABEL, href: '/privacy'},
      ]}
    />
  );
}
