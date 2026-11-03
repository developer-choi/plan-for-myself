'use client';

import {useActionState} from 'react';
import classNames from 'classnames';
import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {continueWithGoogle} from '@/auth/actions';
import GoogleIcon from '@/auth/components/GoogleIcon';
import {CONNECT_KEEPS_RECORDS_HINT, GOOGLE_CONNECT_LABEL} from '@plan-for-myself/shared';
import styles from './GoogleConnectAction.module.scss';

export default function GoogleConnectAction() {
  const [, connectAction, isPending] = useActionState(() => continueWithGoogle('/account'), undefined);

  return (
    <form action={connectAction} className={styles.action}>
      <Button className={styles.button} color="secondary" loading={isPending} size="xLarge" type="submit">
        <GoogleIcon />
        {GOOGLE_CONNECT_LABEL}
      </Button>
      <p className={classNames(typography.body2, styles.hint)}>{CONNECT_KEEPS_RECORDS_HINT}</p>
    </form>
  );
}
