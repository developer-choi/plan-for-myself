import {PropsWithChildren} from 'react';
import TabBar, {TabBarItem} from '@/component/design-system/tab/TabBar';

export default function PrivateLayout({children}: PropsWithChildren) {
  return (
    <>
      <TabBar widthMode="fix" activeMode="path" linkList={LINK_LIST}/>
      {children}
    </>
  );
}

const LINK_LIST: TabBarItem[] = [
  {
    href: '/dashboard',
    children: 'Dashboard'
  },
  {
    href: '/remind-of-message',
    children: 'Remind'
  },
];
