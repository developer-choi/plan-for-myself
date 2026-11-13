import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import {GUEST_ACCOUNT_TITLE, GUEST_DELETE_TEXT} from '@plan-for-myself/shared/auth';
import AccountDeleteAction from '@/auth/components/AccountDeleteAction';
import GoogleConnectAction from '@/auth/components/GoogleConnectAction';
import Card from '@/shared/components/Card';
import styles from './GuestAccount.module.scss';

export default function GuestAccount() {
  return (
    <>
      <Card>
        <p className={classNames(typography.body1, typography.bold)}>{GUEST_ACCOUNT_TITLE}</p>
        <p className={classNames(typography.body2, styles.sub)}>
          기기를 바꾸거나 브라우저 데이터를 지울 때 지금 기록을 다시 볼 수 없어요
        </p>
        <GoogleConnectAction />
      </Card>
      <AccountDeleteAction text={GUEST_DELETE_TEXT} />
    </>
  );
}
