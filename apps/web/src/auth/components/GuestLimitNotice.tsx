import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './GuestLimitNotice.module.scss';

export default function GuestLimitNotice() {
  return (
    <section className={styles.notice}>
      <h2 className={classNames(typography.body2, typography.bold, styles.title)}>
        로그인 없이 이용하기가 잠시 막혔어요
      </h2>
      <p className={classNames(typography.body2, styles.description)}>
        이 IP에서 너무 많은 게스트가 생성돼서 잠시 게스트 시작이 제한되었어요. Google로 계속하면 바로 시작할 수 있어요
      </p>
    </section>
  );
}
