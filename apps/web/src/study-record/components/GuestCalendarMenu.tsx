import HeaderMenu from '@/shared/components/HeaderMenu';

export default function GuestCalendarMenu() {
  return (
    <HeaderMenu
      items={[
        {label: '계정', href: '/account'},
        {label: '개인정보 처리방침', href: '/privacy'},
      ]}
    />
  );
}
