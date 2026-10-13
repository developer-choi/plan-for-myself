import type {Metadata} from 'next';
import classNames from 'classnames';
import Link from 'next/link';
import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import DiscardGuestButton from '@/auth/components/DiscardGuestButton';
import GoogleLoginActions from '@/auth/components/GoogleLoginActions';
import GuestLimitNotice from '@/auth/components/GuestLimitNotice';
import GuestStartButton from '@/auth/components/GuestStartButton';
import LoginNotice from '@/auth/components/LoginNotice';
import RegisteredAccountNotice from '@/auth/components/RegisteredAccountNotice';
import {readRegisteredRejection, shouldShowRegisteredNotice} from '@/auth/login-cookies';
import {getLoginErrorKind} from '@/auth/login-error';
import {auth} from '@/auth/next-auth';
import {getLoginState} from '@/auth/path';
import {DEFAULT_HOME_URL, ENTRY_URL, INTRO_URL} from '@/auth/redirect';
import Logo from '@/shared/components/Logo';
import {
  GOOGLE_CONNECT_LABEL,
  GOOGLE_CONNECT_PAGE_LABEL,
  MY_CALENDAR_LABEL,
  START_RECORDING_LABEL,
} from '@/shared/labels';
import type {SearchParamsPageProps} from '@/shared/types/page';
import styles from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  return {title: getLoginPageCopy(getLoginState(await auth()) === 'guest').title};
}

export default async function Page({searchParams}: SearchParamsPageProps) {
  const [session, rejection, query] = await Promise.all([auth(), readRegisteredRejection(), searchParams]);
  const errorKind = getLoginErrorKind(query);
  const redirect = Array.isArray(query.redirect) ? query.redirect[0] : query.redirect;
  const isGuest = getLoginState(session) === 'guest';
  const copy = getLoginPageCopy(isGuest);
  /* 같은 Google 계정이 다시 넘어와 또 거절되므로 Google 버튼 대신 삭제하지 않고 돌아가는 길을 둔다 */
  const isRejected = shouldShowRegisteredNotice(rejection, session);

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <Link href={ENTRY_URL}>
          <Logo size="large" />
        </Link>
        <header className={styles.text}>
          <h1 className={classNames(typography.h2, typography.bold)}>{copy.title}</h1>
          {copy.description && <p className={classNames(typography.body1, styles.sub)}>{copy.description}</p>}
        </header>
        <div className={styles.actions}>
          {/* 삭제 후 로그인이 실패해 돌아오면 거절 안내 대신 실패 안내 하나만 둔다 */}
          {isRejected && errorKind === null && <RegisteredAccountNotice />}
          {errorKind === 'guest-limit' && <GuestLimitNotice />}
          {errorKind === 'failed' && <LoginNotice title="로그인하지 못했어요">잠시 후 다시 시도해 주세요</LoginNotice>}
          {isRejected ? (
            <>
              <DiscardGuestButton />
              <Button asChild color="secondary" size="xLarge">
                <Link href={DEFAULT_HOME_URL}>삭제하지 않고 내 달력으로</Link>
              </Button>
            </>
          ) : (
            <GoogleLoginActions label={copy.googleLabel} redirect={redirect} />
          )}
          {!isGuest && (
            <div className={styles.guest}>
              <GuestStartButton />
              {/* 문장마다 한 줄로 그린다 — 한 단락으로 흘리면 끝줄에 「수 있어요」만 남는다 */}
              <div className={classNames(typography.body2, styles.guestNote)}>
                <p>이 브라우저에서만 쓸 수 있어요.</p>
                <p>나중에 Google 계정을 연결할 수 있어요.</p>
              </div>
            </div>
          )}
        </div>
        {!isRejected && (
          <Link className={classNames(typography.body2, styles.exitLink)} href={copy.exitHref}>
            {copy.exitLabel}
          </Link>
        )}
      </main>
    </div>
  );
}

interface LoginPageCopy {
  title: string;
  /* undefined: 설명 줄을 그리지 않는 경우 */
  description: string | undefined;
  googleLabel: string;
  exitHref: string;
  exitLabel: string;
}

const LOGGED_OUT_COPY: LoginPageCopy = {
  title: START_RECORDING_LABEL,
  description: '이미 쓰던 계정이 있다면 Google로 로그인하세요.',
  googleLabel: 'Google로 로그인',
  exitHref: INTRO_URL,
  exitLabel: '서비스 소개 보기',
};

const GUEST_COPY: LoginPageCopy = {
  title: GOOGLE_CONNECT_PAGE_LABEL,
  description: undefined,
  googleLabel: GOOGLE_CONNECT_LABEL,
  exitHref: DEFAULT_HOME_URL,
  exitLabel: MY_CALENDAR_LABEL,
};

function getLoginPageCopy(isGuest: boolean): LoginPageCopy {
  return isGuest ? GUEST_COPY : LOGGED_OUT_COPY;
}
