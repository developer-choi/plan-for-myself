import {type PropsWithChildren} from 'react';
import styles from './IntroActions.module.scss';

export default function IntroActions({children}: PropsWithChildren) {
  return <div className={styles.actions}>{children}</div>;
}
