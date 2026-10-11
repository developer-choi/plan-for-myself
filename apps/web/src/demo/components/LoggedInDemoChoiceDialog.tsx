'use client';

import {Button, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {Cross2Icon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import Link from 'next/link';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import styles from './DemoChoiceDialog.module.scss';

interface LoggedInDemoChoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoggedInDemoChoiceDialog({isOpen, onClose}: LoggedInDemoChoiceDialogProps) {
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
        <Button asChild size="large">
          <Link href={DEFAULT_HOME_URL} onClick={onClose}>
            내 달력으로 이동
          </Link>
        </Button>
      </div>
    </Dialog.Root>
  );
}
