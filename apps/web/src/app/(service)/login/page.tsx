import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import GoogleLoginActions from '@/auth/components/GoogleLoginActions';
import LoginBackButton from '@/auth/components/LoginBackButton';
import Logo from '@/shared/components/Logo';
import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.back}>
        <LoginBackButton />
      </div>
      <main className={styles.content}>
        <Logo size="large" />
        <header className={styles.text}>
          <h1 className={classNames(typography.h2, typography.bold)}>로그인</h1>
          <p className={classNames(typography.body1, styles.sub)}>Google 계정으로 간편하게 시작하세요.</p>
        </header>
        <GoogleLoginActions />
      </main>
    </div>
  );
}
