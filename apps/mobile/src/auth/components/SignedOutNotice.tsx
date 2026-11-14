import {SIGNED_OUT_NOTICE} from '@plan-for-myself/shared/auth';
import LoginNotice from '@/auth/components/LoginNotice';

export default function SignedOutNotice() {
  return <LoginNotice title={SIGNED_OUT_NOTICE.title}>{SIGNED_OUT_NOTICE.content}</LoginNotice>;
}
