'use client';

import {useState} from 'react';
import {overlay} from 'overlay-kit';
import {Button, Callout, Confirm} from '@developer-choi/design-system';
import {deleteAccountApi} from '@/auth/api';
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
    <Button className={styles.trigger} color="destructive" size="xLarge" onClick={openConfirm}>
      {text.trigger}
    </Button>
  );
}

function AccountDeleteConfirm({isOpen, text, onClose}: AccountDeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const deleteAccount = async () => {
    setIsFailed(false);
    setIsDeleting(true);
    try {
      await deleteAccountApi();
    } catch {
      setIsFailed(true);
      setIsDeleting(false);
      return;
    }
    window.location.replace('/login');
  };

  return (
    <Confirm
      confirmProps={{children: text.confirm, color: 'destructive', loading: isDeleting}}
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
