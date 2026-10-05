import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import GoogleLoginActions from '@/auth/components/GoogleLoginActions';
import GuestLoginButton from '@/auth/components/GuestLoginButton';
import LoginBackButton from '@/auth/components/LoginBackButton';
import RegisteredAccountNotice from '@/auth/components/RegisteredAccountNotice';
import {readRegisteredRejection, shouldShowRegisteredNotice} from '@/auth/login-cookies';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import Logo from '@/shared/components/Logo';
import styles from './page.module.scss';

export default async function Page() {
  const [session, rejection] = await Promise.all([auth(), readRegisteredRejection()]);
  const loginState = getLoginState(session);

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
        <div className={styles.actions}>
          {shouldShowRegisteredNotice(rejection, session) && <RegisteredAccountNotice />}
          <GoogleLoginActions />
          {/* 로그인 없이 이용 중인 사람이 누르면 새 사용자가 또 생기므로, 로그아웃 상태에서만 보인다 */}
          {loginState === 'logged-out' && <GuestLoginButton />}
        </div>
      </main>
    </div>
  );
}
