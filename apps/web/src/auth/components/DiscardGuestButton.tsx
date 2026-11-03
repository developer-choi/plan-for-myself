'use client';

import {useTransition} from 'react';
import {DISCARD_LABEL, GUEST_DELETE_TEXT} from '@plan-for-myself/shared';
import {openOnce} from '@plan-for-myself/shared/react';
import {Button, Confirm} from '@developer-choi/design-system';
import {discardGuestAndContinueWithGoogle} from '@/auth/actions';

interface DiscardGuestConfirmProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscardGuestButton() {
  const openConfirm = () => {
    openOnce('discard-guest-confirm', ({isOpen, unmount}) => <DiscardGuestConfirm isOpen={isOpen} onClose={unmount} />);
  };

  return (
    <Button color="destructive" size="xLarge" onClick={openConfirm}>
      {DISCARD_LABEL}
    </Button>
  );
}

function DiscardGuestConfirm({isOpen, onClose}: DiscardGuestConfirmProps) {
  const [isPending, startTransition] = useTransition();

  const discardGuest = () => {
    startTransition(() => discardGuestAndContinueWithGoogle());
  };

  return (
    <Confirm
      confirmProps={{children: GUEST_DELETE_TEXT.confirm, color: 'destructive', loading: isPending}}
      content={<p>{GUEST_DELETE_TEXT.content}</p>}
      open={isOpen}
      title={DISCARD_LABEL}
      onCancel={onClose}
      onConfirm={discardGuest}
    />
  );
}
