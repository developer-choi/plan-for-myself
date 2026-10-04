'use client';

import {signOut} from 'next-auth/react';
import HeaderMenu from '@/shared/components/HeaderMenu';

interface CalendarMenuProps {
  viewPath: string;
}

export default function CalendarMenu({viewPath}: CalendarMenuProps) {
  const logout = () => {
    signOut({redirectTo: `/login?redirect=${encodeURIComponent(viewPath)}`});
  };

  return (
    <HeaderMenu
      items={[
        {label: '개인정보 처리방침', href: '/privacy'},
        {label: '로그아웃', onClick: logout},
      ]}
    />
  );
}
