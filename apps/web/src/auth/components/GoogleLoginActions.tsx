'use client';

import {useActionState} from 'react';
import {Button} from '@developer-choi/design-system';
import {continueWithGoogle} from '@/auth/actions';
import GoogleIcon from '@/auth/components/GoogleIcon';
import styles from './GoogleLoginActions.module.scss';

interface GoogleLoginActionsProps {
  /* undefined: 로그인 뒤 돌아갈 주소 없이 로그인 페이지에 온 경우 */
  redirect: string | undefined;
  label: string;
}

export default function GoogleLoginActions({redirect, label}: GoogleLoginActionsProps) {
  const [, submitAction, isPending] = useActionState(() => continueWithGoogle(redirect), undefined);

  return (
    <form action={submitAction} className={styles.actions}>
      <Button color="secondary" loading={isPending} size="xLarge" type="submit">
        <GoogleIcon />
        {label}
      </Button>
    </form>
  );
}
