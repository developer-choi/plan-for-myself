'use client';

import {ACCOUNT_LABEL, LOGOUT_LABEL, PRIVACY_POLICY_LABEL} from '@plan-for-myself/shared';
import {ENTRY_URL, INTRO_URL} from '@/auth/redirect';
import {signOutAndReplace} from '@/auth/sign-out';
import {DEMO_HOME_URL} from '@/demo/demo-path';
import HeaderMenu from '@/shared/components/HeaderMenu';
import {DEMO_TOUR_LABEL} from '@/shared/labels';

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
