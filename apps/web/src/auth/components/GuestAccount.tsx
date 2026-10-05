import Link from 'next/link';
import classNames from 'classnames';
import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import AccountDeleteAction, {type AccountDeleteText} from '@/auth/components/AccountDeleteAction';
import Card from '@/shared/components/Card';
import styles from './GuestAccount.module.scss';

export default function GuestAccount() {
  return (
    <>
      <Card>
        <p className={classNames(typography.body1, typography.bold)}>로그인하지 않고 이용 중</p>
        <p className={classNames(typography.body2, styles.sub)}>
          기기를 바꾸거나 브라우저 데이터를 지우면 기록이 사라져요
        </p>
      </Card>
      <Button asChild className={styles.login} size="xLarge">
        <Link href="/login">로그인하기</Link>
      </Button>
      <AccountDeleteAction text={GUEST_DELETE_TEXT} />
    </>
  );
}

const GUEST_DELETE_TEXT = {
  trigger: '기록 모두 지우기',
  content: '이 기기에 쌓인 기록을 모두 지워요. 되돌릴 수 없어요.',
  confirm: '지우기',
  failure: '기록을 지우지 못했어요. 잠시 뒤 다시 시도해 주세요',
} satisfies AccountDeleteText;
