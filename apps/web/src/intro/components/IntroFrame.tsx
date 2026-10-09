import {type PropsWithChildren} from 'react';
import styles from './IntroFrame.module.scss';

export default function IntroFrame({children}: PropsWithChildren) {
  return (
    <div inert className={styles.frame}>
      {children}
    </div>
  );
}
