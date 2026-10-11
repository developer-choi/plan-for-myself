import {INTRO_URL} from '@/auth/redirect';
import {DEMO_HOME_URL} from '@/demo/demo-path';
import HeaderMenu from '@/shared/components/HeaderMenu';

export default function GuestCalendarMenu() {
  return (
    <HeaderMenu
      items={[
        {label: '계정', href: '/account'},
        {label: '서비스 소개', href: INTRO_URL},
        {label: '사용법 보기', href: DEMO_HOME_URL},
        {label: '개인정보 처리방침', href: '/privacy'},
      ]}
    />
  );
}
