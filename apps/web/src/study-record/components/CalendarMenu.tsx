'use client';

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
        {label: '서비스 소개', href: INTRO_URL},
        {label: '계정', href: '/account'},
        {label: '개인정보 처리방침', href: '/privacy'},
        {label: '로그아웃', onClick: logout},
      ]}
    />
  );
}
