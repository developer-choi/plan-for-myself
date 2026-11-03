import {GUEST_LIMIT_NOTICE} from '@plan-for-myself/shared';
import LoginNotice from '@/auth/components/LoginNotice';

export default function GuestLimitNotice() {
  return <LoginNotice title={GUEST_LIMIT_NOTICE.title}>{GUEST_LIMIT_NOTICE.content}</LoginNotice>;
}
