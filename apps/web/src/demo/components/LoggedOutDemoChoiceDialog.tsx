'use client';

import {Button, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {Cross2Icon} from '@radix-ui/react-icons';
import {captureException} from '@sentry/nextjs';
import classNames from 'classnames';
import Link from 'next/link';
import {signIn} from 'next-auth/react';
import {useState} from 'react';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import {useHandleClientSideError} from '@/shared/error/useHandleClientSideError';
import styles from './DemoChoiceDialog.module.scss';

interface LoggedOutDemoChoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoggedOutDemoChoiceDialog({isOpen, onClose}: LoggedOutDemoChoiceDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleClientSideError = useHandleClientSideError();

  const startAsGuest = async () => {
    setLoading(true);
    try {
      await signIn('guest', {callbackUrl: DEFAULT_HOME_URL});
    } catch (error) {
      captureException(error);
      handleClientSideError(error);
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Dialog.Close asChild>
        <IconButton aria-label="닫기" className={styles.close} icon={<Cross2Icon />} />
      </Dialog.Close>
      <Dialog.Title className={classNames(typography.body1, typography.bold, styles.message)}>
        체험 중인 상태에서는 기록을 작성할 수 없어요
      </Dialog.Title>
      <div className={styles.options}>
        <Button color="secondary" size="large" onClick={onClose}>
          계속 체험하기
        </Button>
        <Button color="secondary" loading={loading} size="large" variant="outlined" onClick={startAsGuest}>
          로그인 없이 이용하기
        </Button>
        <Button asChild size="large">
          <Link href="/login" onClick={onClose}>
            로그인해서 이용하기
          </Link>
        </Button>
      </div>
    </Dialog.Root>
  );
}
