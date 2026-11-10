'use client';

import {useActionState} from 'react';
import {usePathname} from 'next/navigation';
import classNames from 'classnames';
import {Cross2Icon} from '@radix-ui/react-icons';
import {Button, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {useLoginNudge} from '@plan-for-myself/shared/auth/react';
import {GOOGLE_CONNECT_LABEL} from '@plan-for-myself/shared/label';
import {continueWithGoogle} from '@/auth/actions';
import {webLoginNudgeStore} from '@/auth/login-nudge-store';
import styles from './LoginNudgeCard.module.scss';

interface LoginNudgeCardProps {
  today: string;
  recordedDays: number;
}

export default function LoginNudgeCard({today, recordedDays}: LoginNudgeCardProps) {
  const loginNudge = useLoginNudge(today, recordedDays, webLoginNudgeStore);
  const pathname = usePathname();
  const [, connectAction, isPending] = useActionState(() => continueWithGoogle(pathname), undefined);

  if (!loginNudge.visible) {
    return null;
  }

  return (
    <section className={styles.card}>
      <p className={classNames(typography.body2, styles.message)}>
        Google 계정을 연결하지 않으면 기기를 바꾸거나 브라우저 데이터를 지울 때 지금 기록을 다시 볼 수 없어요
      </p>
      <form action={connectAction}>
        <Button loading={isPending} size="small" type="submit" variant="outlined">
          {GOOGLE_CONNECT_LABEL}
        </Button>
      </form>
      <IconButton className={styles.close} icon={<Cross2Icon />} onClick={loginNudge.dismiss} />
    </section>
  );
}
