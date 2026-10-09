import classNames from 'classnames';
import {Callout} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import GoogleLoginActions from '@/auth/components/GoogleLoginActions';
import GuestLimitNotice from '@/auth/components/GuestLimitNotice';
import LoginBackButton from '@/auth/components/LoginBackButton';
import RegisteredAccountNotice from '@/auth/components/RegisteredAccountNotice';
import {readRegisteredRejection, shouldShowRegisteredNotice} from '@/auth/login-cookies';
import {getLoginErrorKind} from '@/auth/login-error';
import {auth} from '@/auth/next-auth';
import Logo from '@/shared/components/Logo';
import type {SearchParamsPageProps} from '@/shared/types/page';
import styles from './page.module.scss';

export default async function Page({searchParams}: SearchParamsPageProps) {
  const [session, rejection, query] = await Promise.all([auth(), readRegisteredRejection(), searchParams]);
  const errorKind = getLoginErrorKind(query);

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
          {errorKind === 'guest-limit' && <GuestLimitNotice />}
          {errorKind === 'failed' && <Callout color="danger">로그인하지 못했어요. 잠시 뒤 다시 시도해 주세요.</Callout>}
          <GoogleLoginActions />
        </div>
      </main>
    </div>
  );
}
