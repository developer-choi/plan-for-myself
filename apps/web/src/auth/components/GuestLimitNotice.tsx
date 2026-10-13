import LoginNotice from '@/auth/components/LoginNotice';

export default function GuestLimitNotice() {
  return (
    <LoginNotice title="게스트로 시작하기가 잠시 막혔어요">
      짧은 시간에 게스트가 너무 많이 만들어져 잠시 막았어요. Google로 로그인하면 바로 시작할 수 있어요
    </LoginNotice>
  );
}
