import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './GuestLimitNotice.module.scss';

export default function GuestLimitNotice() {
  return (
    <section className={styles.notice}>
      <h2 className={classNames(typography.body2, typography.bold, styles.title)}>게스트로 시작하기가 잠시 막혔어요</h2>
      <p className={classNames(typography.body2, styles.description)}>
        짧은 시간에 게스트가 너무 많이 만들어져 잠시 막았어요. Google로 로그인하면 바로 시작할 수 있어요.
      </p>
    </section>
  );
}
