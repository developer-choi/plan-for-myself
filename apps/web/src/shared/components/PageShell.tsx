import {type PropsWithChildren} from 'react';
import styles from './PageShell.module.scss';

export default function PageShell({children}: PropsWithChildren) {
  return <div className={styles.shell}>{children}</div>;
}
