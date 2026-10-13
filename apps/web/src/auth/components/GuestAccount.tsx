import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import AccountDeleteAction, {type AccountDeleteText} from '@/auth/components/AccountDeleteAction';
import GoogleConnectAction from '@/auth/components/GoogleConnectAction';
import Card from '@/shared/components/Card';
import styles from './GuestAccount.module.scss';

export default function GuestAccount() {
  return (
    <>
      <Card>
        <p className={classNames(typography.body1, typography.bold)}>게스트 계정으로 이용 중</p>
        <p className={classNames(typography.body2, styles.sub)}>
          기기를 바꾸거나 브라우저 데이터를 지울 때 지금 기록을 다시 볼 수 없어요
        </p>
      </Card>
      <GoogleConnectAction />
      <AccountDeleteAction text={GUEST_DELETE_TEXT} />
    </>
  );
}

const GUEST_DELETE_TEXT = {
  trigger: '게스트 계정 삭제',
  content: '계정과 기록을 모두 삭제해요. 되돌릴 수 없어요.',
  confirm: '삭제',
  failure: '게스트 계정을 삭제하지 못했어요. 잠시 뒤 다시 시도해 주세요',
} satisfies AccountDeleteText;
