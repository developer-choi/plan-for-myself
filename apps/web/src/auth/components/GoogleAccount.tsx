import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import AccountDeleteAction, {type AccountDeleteText} from '@/auth/components/AccountDeleteAction';
import Card from '@/shared/components/Card';

export default function GoogleAccount() {
  return (
    <>
      <Card>
        <p className={classNames(typography.body1, typography.bold)}>Google 계정으로 로그인 중</p>
      </Card>
      <AccountDeleteAction text={GOOGLE_DELETE_TEXT} />
    </>
  );
}

const GOOGLE_DELETE_TEXT = {
  trigger: '회원 탈퇴',
  content: '계정과 기록을 모두 지워요. 되돌릴 수 없어요.',
  confirm: '탈퇴하기',
  failure: '탈퇴하지 못했어요. 잠시 뒤 다시 시도해 주세요',
} satisfies AccountDeleteText;
