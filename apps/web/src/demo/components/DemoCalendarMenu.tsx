import {DEFAULT_HOME_URL, INTRO_URL} from '@/auth/redirect';
import HeaderMenu from '@/shared/components/HeaderMenu';
import {MY_CALENDAR_LABEL} from '@/shared/labels';

interface DemoCalendarMenuProps {
  isLoggedIn: boolean;
}

export default function DemoCalendarMenu({isLoggedIn}: DemoCalendarMenuProps) {
  return (
    <HeaderMenu
      items={[
        ...(isLoggedIn ? [{label: MY_CALENDAR_LABEL, href: DEFAULT_HOME_URL}] : []),
        {label: '서비스 소개', href: INTRO_URL},
        {label: '개인정보 처리방침', href: '/privacy'},
      ]}
    />
  );
}
