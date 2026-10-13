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
      <h2 className={classNames(typography.body2, typography.bold, styles.title)}>이 Google 계정은 연결할 수 없어요</h2>
      {/* 문장마다 한 줄로 그린다 — 한 단락으로 흘리면 휴대폰 폭에서 「게스 / 트」처럼 낱말 가운데서 꺾인다 */}
      <div className={classNames(typography.body2, styles.description)}>
        <p>이미 가입된 Google 계정이에요</p>
        <p>로그인하면 지금 게스트 계정과 기록이 삭제돼요</p>
      </div>
      <form action={submitAction} className={styles.discardForm}>
        <Button color="destructive" loading={isPending} size="xLarge" type="submit">
          게스트 계정 삭제 후 로그인
        </Button>
      </form>
    </section>
  );
}
