import {REGISTERED_ACCOUNT_NOTICE} from '@plan-for-myself/shared';
import LoginNotice from '@/auth/components/LoginNotice';

export default function RegisteredAccountNotice() {
  return (
    <LoginNotice title={REGISTERED_ACCOUNT_NOTICE.title}>
      {`${REGISTERED_ACCOUNT_NOTICE.reason}\n${REGISTERED_ACCOUNT_NOTICE.consequence}`}
    </LoginNotice>
  );
}
