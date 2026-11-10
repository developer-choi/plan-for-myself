'use client';

import {
  ACCOUNT_LABEL,
  DEMO_HOME_URL,
  DEMO_TOUR_LABEL,
  LOGOUT_LABEL,
  PRIVACY_POLICY_LABEL,
} from '@plan-for-myself/shared';
import {ENTRY_URL, INTRO_URL} from '@/auth/redirect';
import {signOutAndReplace} from '@/auth/sign-out';
import HeaderMenu from '@/shared/components/HeaderMenu';

export default function CalendarMenu() {
  const logout = () => {
    signOutAndReplace(ENTRY_URL);
  };

  return (
    <HeaderMenu
      items={[
        {label: ACCOUNT_LABEL, href: '/account'},
        {label: '서비스 소개', href: INTRO_URL},
        {label: DEMO_TOUR_LABEL, href: DEMO_HOME_URL},
        {label: PRIVACY_POLICY_LABEL, href: '/privacy'},
        {label: LOGOUT_LABEL, onClick: logout},
      ]}
    />
  );
}
