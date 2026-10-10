import {type PropsWithChildren} from 'react';
import styles from './PageColumn.module.scss';

export default function PageColumn({children}: PropsWithChildren) {
  return <div className={styles.centered}>{children}</div>;
}
