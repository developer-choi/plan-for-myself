import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import {GOOGLE_ACCOUNT_TITLE, GOOGLE_DELETE_TEXT} from '@plan-for-myself/shared/auth';
import AccountDeleteAction from '@/auth/components/AccountDeleteAction';
import Card from '@/shared/components/Card';

export default function GoogleAccount() {
  return (
    <>
      <Card>
        <p className={classNames(typography.body1, typography.bold)}>{GOOGLE_ACCOUNT_TITLE}</p>
      </Card>
      <AccountDeleteAction text={GOOGLE_DELETE_TEXT} />
    </>
  );
}
