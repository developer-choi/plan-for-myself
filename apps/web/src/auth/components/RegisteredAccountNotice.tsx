'use client';

import {useActionState} from 'react';
import classNames from 'classnames';
import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {discardGuestAndContinueWithGoogle} from '@/auth/actions';
import styles from './RegisteredAccountNotice.module.scss';

export default function RegisteredAccountNotice() {
  const [, submitAction, isPending] = useActionState(() => discardGuestAndContinueWithGoogle(), undefined);

  return (
    <section className={styles.notice}>
      <h2 className={classNames(typography.body2, typography.bold, styles.title)}>이미 가입된 계정이에요</h2>
      <p className={classNames(typography.body2, styles.description)}>
        지금 기록은 그대로 있어요. 아래 버튼을 누르면 삭제돼요
      </p>
      <form action={submitAction} className={styles.discardForm}>
        <Button color="destructive" loading={isPending} size="xLarge" type="submit">
          지금 기록 삭제하고 로그인
        </Button>
      </form>
    </section>
  );
}
