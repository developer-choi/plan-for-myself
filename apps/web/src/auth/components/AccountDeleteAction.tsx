'use client';

import {captureException} from '@sentry/nextjs';
import {useMutation} from '@tanstack/react-query';
import {overlay} from 'overlay-kit';
import classNames from 'classnames';
import {Callout, Confirm} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {deleteAccountApi} from '@/auth/api';
import {ENTRY_URL} from '@/auth/redirect';
import {isMutationSettling} from '@/shared/query/mutation';
import styles from './AccountDeleteAction.module.scss';

export interface AccountDeleteText {
  trigger: string;
  content: string;
  confirm: string;
  failure: string;
}

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
    overlay.open(({isOpen, unmount}) => <AccountDeleteConfirm isOpen={isOpen} text={text} onClose={unmount} />);
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
  const deleteMutation = useMutation({mutationFn: deleteAccountApi});

  const deleteAccount = async () => {
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      captureException(error);
      return;
    }
    window.location.replace(ENTRY_URL);
  };

  return (
    <Confirm
      confirmProps={{children: text.confirm, color: 'destructive', loading: isMutationSettling(deleteMutation)}}
      content={
        <>
          <p>{text.content}</p>
          {deleteMutation.isError && (
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
