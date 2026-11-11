'use client';

import {captureException} from '@sentry/nextjs';
import type {AccountDeleteText} from '@plan-for-myself/shared/auth';
import {useAccountDelete} from '@plan-for-myself/shared/auth/react';
import {openOnce} from '@plan-for-myself/shared/overlay';
import classNames from 'classnames';
import {Callout, Confirm} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {accountApi} from '@/auth/api';
import {ENTRY_URL} from '@/auth/redirect';
import {signOutAndReplace} from '@/auth/sign-out';
import styles from './AccountDeleteAction.module.scss';

interface AccountDeleteActionProps {
  text: AccountDeleteText;
}

interface AccountDeleteConfirmProps {
  isOpen: boolean;
  text: AccountDeleteText;
  onClose: () => void;
}

export default function AccountDeleteAction({text}: AccountDeleteActionProps) {
  const openConfirm = () => {
    openOnce('account-delete-confirm', ({isOpen, unmount}) => (
      <AccountDeleteConfirm isOpen={isOpen} text={text} onClose={unmount} />
    ));
  };

  return (
    <div className={styles.section}>
      <button className={classNames(typography.body2, styles.trigger)} type="button" onClick={openConfirm}>
        {text.trigger}
      </button>
    </div>
  );
}

function AccountDeleteConfirm({isOpen, text, onClose}: AccountDeleteConfirmProps) {
  const {
    isSettling,
    isFailed,
    handlers: {deleteAccount},
  } = useAccountDelete({
    deleteAccountApi: accountApi.deleteAccountApi,
    onDeleted: () => signOutAndReplace(ENTRY_URL),
    reportError: captureException,
  });

  return (
    <Confirm
      confirmProps={{children: text.confirm, color: 'destructive', loading: isSettling}}
      content={
        <>
          <p>{text.content}</p>
          {isFailed && (
            <Callout className={styles.failure} color="danger">
              {text.failure}
            </Callout>
          )}
        </>
      }
      open={isOpen}
      title={text.trigger}
      onCancel={onClose}
      onConfirm={deleteAccount}
    />
  );
}
