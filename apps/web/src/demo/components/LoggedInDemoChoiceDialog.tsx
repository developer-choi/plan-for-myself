'use client';

import {
  DEMO_CONTINUE_LABEL,
  type DemoChoiceDialogProps,
  LOGGED_IN_DEMO_CHOICE_TITLES,
} from '@plan-for-myself/shared/demo';
import {MY_CALENDAR_LABEL} from '@plan-for-myself/shared/label';
import {Button, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {Cross2Icon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import Link from 'next/link';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import {focusOnMount} from '@/demo/focus-on-mount';
import styles from './DemoChoiceDialog.module.scss';

export default function LoggedInDemoChoiceDialog({isOpen, onClose, reason}: DemoChoiceDialogProps) {
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
        {LOGGED_IN_DEMO_CHOICE_TITLES[reason]}
      </Dialog.Title>
      <div className={styles.options}>
        <Button asChild size="large">
          <Link href={DEFAULT_HOME_URL} onClick={onClose}>
            {MY_CALENDAR_LABEL}
          </Link>
        </Button>
        <button className={classNames(typography.body2, styles.textLink)} type="button" onClick={onClose}>
          {DEMO_CONTINUE_LABEL}
        </button>
      </div>
    </Dialog.Root>
  );
}
