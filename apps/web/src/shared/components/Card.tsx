import {type PropsWithChildren} from 'react';
import styles from './Card.module.scss';

export default function Card({children}: PropsWithChildren) {
  return <div className={styles.card}>{children}</div>;
}
