import {DISCARD_LABEL, GUEST_DELETE_TEXT} from '@plan-for-myself/shared/auth';
import {openOnce} from '@plan-for-myself/shared/overlay';
import {useRef, useState} from 'react';
import Button from '@/shared/components/Button';
import Confirm from '@/shared/components/Confirm';

interface DiscardGuestButtonProps {
  onConfirm: () => Promise<void>;
}

interface DiscardGuestConfirmProps {
  isOpen: boolean;
  handlers: {
    onClose: () => void;
    onConfirm: () => Promise<void>;
  };
}

export default function DiscardGuestButton({onConfirm}: DiscardGuestButtonProps) {
  const openConfirm = () => {
    openOnce('discard-guest-confirm', ({isOpen, unmount}) => (
      <DiscardGuestConfirm handlers={{onClose: unmount, onConfirm}} isOpen={isOpen} />
    ));
  };

  return <Button color="destructive" label={DISCARD_LABEL} size="xLarge" onPress={openConfirm} />;
}

function DiscardGuestConfirm({isOpen, handlers}: DiscardGuestConfirmProps) {
  const [isPending, setIsPending] = useState(false);
  const isPendingCache = useRef(false);

  const discardGuest = async () => {
    if (isPendingCache.current) {
      return;
    }

    isPendingCache.current = true;
    setIsPending(true);
    try {
      await handlers.onConfirm();
    } finally {
      isPendingCache.current = false;
      setIsPending(false);
      handlers.onClose();
    }
  };

  return (
    <Confirm
      confirmLabel={GUEST_DELETE_TEXT.confirm}
      content={GUEST_DELETE_TEXT.content}
      handlers={{onCancel: handlers.onClose, onConfirm: discardGuest}}
      loading={isPending}
      open={isOpen}
      title={DISCARD_LABEL}
    />
  );
}
