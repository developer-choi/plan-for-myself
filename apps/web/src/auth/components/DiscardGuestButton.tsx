'use client';

import {useTransition} from 'react';
import {overlay} from 'overlay-kit';
import {Button, Confirm} from '@developer-choi/design-system';
import {discardGuestAndContinueWithGoogle} from '@/auth/actions';

interface DiscardGuestConfirmProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscardGuestButton() {
  const openConfirm = () => {
    overlay.open(({isOpen, unmount}) => <DiscardGuestConfirm isOpen={isOpen} onClose={unmount} />);
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
      confirmProps={{children: '삭제', color: 'destructive', loading: isPending}}
      content={<p>계정과 기록을 모두 삭제해요. 되돌릴 수 없어요.</p>}
      open={isOpen}
      title={DISCARD_LABEL}
      onCancel={onClose}
      onConfirm={discardGuest}
    />
  );
}

const DISCARD_LABEL = '게스트 계정 삭제 후 로그인';
