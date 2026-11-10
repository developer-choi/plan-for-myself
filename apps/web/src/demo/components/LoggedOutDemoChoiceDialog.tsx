'use client';

import {Button, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {Cross2Icon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import Link from 'next/link';
import {
  DEMO_CONTINUE_LABEL,
  type DemoChoiceDialogProps,
  LOGGED_OUT_DEMO_CHOICE_MESSAGES,
  START_RECORDING_LABEL,
} from '@plan-for-myself/shared';
import {focusOnMount} from '@/demo/focus-on-mount';
import styles from './DemoChoiceDialog.module.scss';

export default function LoggedOutDemoChoiceDialog({isOpen, onClose, reason}: DemoChoiceDialogProps) {
  const {title, description} = LOGGED_OUT_DEMO_CHOICE_MESSAGES[reason];

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
        {title}
      </Dialog.Title>
      <div className={classNames(typography.body2, styles.description)}>
        {description.map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
      </div>
      <div className={styles.options}>
        <Button asChild size="large">
          <Link href="/login" onClick={onClose}>
            {START_RECORDING_LABEL}
          </Link>
        </Button>
        <button className={classNames(typography.body2, styles.textLink)} type="button" onClick={onClose}>
          {DEMO_CONTINUE_LABEL}
        </button>
      </div>
    </Dialog.Root>
  );
}
