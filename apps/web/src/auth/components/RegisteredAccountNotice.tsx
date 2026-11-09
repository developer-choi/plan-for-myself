import {REGISTERED_ACCOUNT_NOTICE} from '@plan-for-myself/shared/auth';
import LoginNotice from '@/auth/components/LoginNotice';

export default function RegisteredAccountNotice() {
  return (
    <LoginNotice title={REGISTERED_ACCOUNT_NOTICE.title}>
      {/* 문장마다 한 줄로 그린다 — 한 단락으로 흘리면 휴대폰 폭에서 「게스 / 트」처럼 낱말 가운데서 꺾인다 */}
      {REGISTERED_ACCOUNT_NOTICE.reason}
      <br />
      {REGISTERED_ACCOUNT_NOTICE.consequence}
    </LoginNotice>
  );
}
