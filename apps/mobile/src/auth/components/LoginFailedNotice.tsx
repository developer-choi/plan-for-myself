import {LOGIN_FAILED_NOTICE} from '@plan-for-myself/shared';
import LoginNotice from '@/auth/components/LoginNotice';

export default function LoginFailedNotice() {
  return <LoginNotice title={LOGIN_FAILED_NOTICE.title}>{LOGIN_FAILED_NOTICE.content}</LoginNotice>;
}
