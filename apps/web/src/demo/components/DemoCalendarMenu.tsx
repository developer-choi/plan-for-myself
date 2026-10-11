import {DEFAULT_HOME_URL, INTRO_URL} from '@/auth/redirect';
import HeaderMenu from '@/shared/components/HeaderMenu';

interface DemoCalendarMenuProps {
  isLoggedIn: boolean;
}

export default function DemoCalendarMenu({isLoggedIn}: DemoCalendarMenuProps) {
  return (
    <HeaderMenu
      items={[
        ...(isLoggedIn ? [{label: '내 달력으로 이동', href: DEFAULT_HOME_URL}] : []),
        {label: '서비스 소개', href: INTRO_URL},
        {label: '개인정보 처리방침', href: '/privacy'},
      ]}
    />
  );
}
