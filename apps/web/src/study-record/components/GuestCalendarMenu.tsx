import {ACCOUNT_LABEL, DEMO_HOME_URL, DEMO_TOUR_LABEL, PRIVACY_POLICY_LABEL} from '@plan-for-myself/shared';
import {INTRO_URL} from '@/auth/redirect';
import HeaderMenu from '@/shared/components/HeaderMenu';

export default function GuestCalendarMenu() {
  return (
    <HeaderMenu
      items={[
        {label: ACCOUNT_LABEL, href: '/account'},
        {label: '서비스 소개', href: INTRO_URL},
        {label: DEMO_TOUR_LABEL, href: DEMO_HOME_URL},
        {label: PRIVACY_POLICY_LABEL, href: '/privacy'},
      ]}
    />
  );
}
