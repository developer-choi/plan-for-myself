import LoginNotice from '@/auth/components/LoginNotice';

export default function RegisteredAccountNotice() {
  return (
    <LoginNotice title="이 Google 계정은 연결할 수 없어요">
      {/* 문장마다 한 줄로 그린다 — 한 단락으로 흘리면 휴대폰 폭에서 「게스 / 트」처럼 낱말 가운데서 꺾인다 */}
      이미 가입된 Google 계정이에요
      <br />
      로그인하면 지금 게스트 계정과 기록이 삭제돼요
    </LoginNotice>
  );
}
