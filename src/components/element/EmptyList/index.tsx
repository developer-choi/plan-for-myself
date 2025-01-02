import {PropsWithChildren} from 'react';
import styles from './index.module.scss';

// TODO 적용 필요
export default function EmptyList({children = '목록이 없어요'}: PropsWithChildren) {
  return (
    <div className={styles.container}>{children}</div>
  );
}
