'use client';

import {Button, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {Cross2Icon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import Link from 'next/link';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import {focusOnMount} from '@/demo/focus-on-mount';
import type {DemoChoiceReason} from '@/demo/demo-choice-reason';
import {MY_CALENDAR_LABEL} from '@/shared/labels';
import styles from './DemoChoiceDialog.module.scss';

interface LoggedInDemoChoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reason: DemoChoiceReason;
}

export default function LoggedInDemoChoiceDialog({isOpen, onClose, reason}: LoggedInDemoChoiceDialogProps) {
  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Dialog.Close asChild>
        <IconButton className={styles.close} icon={<Cross2Icon />} />
      </Dialog.Close>
      <Dialog.Title
        ref={focusOnMount}
        className={classNames(typography.body1, typography.bold, styles.title)}
        tabIndex={-1}
      >
        {TITLES[reason]}
      </Dialog.Title>
      <div className={styles.options}>
        <Button asChild size="large">
          <Link href={DEFAULT_HOME_URL} onClick={onClose}>
            {MY_CALENDAR_LABEL}
          </Link>
        </Button>
        <button className={classNames(typography.body2, styles.textLink)} type="button" onClick={onClose}>
          계속 둘러보기
        </button>
      </div>
    </Dialog.Root>
  );
}

const TITLES: Record<DemoChoiceReason, string> = {
  'tour-end': '이제 내 달력에서 이어서 적어 보세요',
  'date-click': '예시 화면에서는 기록할 수 없어요',
};
