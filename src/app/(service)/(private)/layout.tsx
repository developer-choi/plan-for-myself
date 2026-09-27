import {PropsWithChildren} from 'react';
import styles from './layout.module.scss';

export default function PrivateLayout({children}: PropsWithChildren) {
  return (
    <div className={styles.wrap}>
      <main className={styles.page}>
        {children}
      </main>
      {/* footer */}
    </div>
  );
}
