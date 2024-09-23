import {PropsWithChildren} from 'react';
import TabBar, {TabBarItem} from '@/components/layout/TabBar';
import styles from './layout.module.scss';

export default function PrivateLayout({children}: PropsWithChildren) {
  return (
    <>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <TabBar widthMode="fix" activeMode="path" linkList={LINK_LIST}/>
        </header>
        <main className={styles.page}>
          {children}
        </main>
        {/* footer */}
      </div>
    </>
  );
}

const LINK_LIST: TabBarItem[] = [
  {
    href: '/habit',
    children: 'Habit'
  },
  {
    href: '/studied-time',
    children: 'Studied Time'
  },
  {
    href: '/remind-of-message',
    children: 'Remind'
  },
];
