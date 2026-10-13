import {type PropsWithChildren} from 'react';
import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './LoginNotice.module.scss';

interface LoginNoticeProps {
  title: string;
}

export default function LoginNotice({title, children}: PropsWithChildren<LoginNoticeProps>) {
  return (
    <section className={styles.notice}>
      <h2 className={classNames(typography.body2, typography.bold, styles.title)}>{title}</h2>
      <p className={classNames(typography.body2, styles.description)}>{children}</p>
    </section>
  );
}
