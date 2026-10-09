'use client';

import {signOut} from 'next-auth/react';
import {INTRO_URL} from '@/auth/redirect';
import HeaderMenu from '@/shared/components/HeaderMenu';

export default function CalendarMenu() {
  const logout = () => {
    signOut({redirectTo: INTRO_URL});
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
