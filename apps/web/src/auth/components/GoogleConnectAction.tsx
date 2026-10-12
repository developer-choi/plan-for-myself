'use client';

import {useActionState} from 'react';
import classNames from 'classnames';
import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {continueWithGoogle} from '@/auth/actions';
import styles from './GoogleConnectAction.module.scss';

export default function GoogleConnectAction() {
  const [, connectAction, isPending] = useActionState(() => continueWithGoogle('/account'), undefined);

  return (
    <form action={connectAction} className={styles.action}>
      <Button className={styles.button} loading={isPending} size="xLarge" type="submit">
        Google 계정 연결하기
      </Button>
      <p className={classNames(typography.body2, styles.hint)}>지금 기록이 그대로 이어져요</p>
    </form>
  );
}
