import {StyleSheet, View} from 'react-native';
import {captureException} from '@sentry/react-native';
import {type AccountDeleteText, colors} from '@plan-for-myself/shared';
import {openOnce, useAccountDelete} from '@plan-for-myself/shared/react';
import {accountApi} from '@/auth/api';
import {useSession} from '@/auth/session-context';
import Button from '@/shared/components/Button';
import Confirm from '@/shared/components/Confirm';
import {spacing} from '@/shared/styles/design-tokens';

interface AccountDeleteActionProps {
  text: AccountDeleteText;
}

interface AccountDeleteConfirmProps {
  isOpen: boolean;
  text: AccountDeleteText;
  handlers: {
    onClose: () => void;
  };
}

export default function AccountDeleteAction({text}: AccountDeleteActionProps) {
  const openConfirm = () => {
    openOnce('account-delete-confirm', ({isOpen, unmount}) => (
      <AccountDeleteConfirm handlers={{onClose: unmount}} isOpen={isOpen} text={text} />
    ));
  };

  return (
    <View style={styles.section}>
      <Button
        color="destructive"
        label={text.trigger}
        size="medium"
        style={styles.trigger}
        variant="text"
        onPress={openConfirm}
      />
    </View>
  );
}

const TRIGGER_HEIGHT = 40;

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  trigger: {
    minHeight: TRIGGER_HEIGHT,
    paddingHorizontal: spacing.sm,
  },
});

function AccountDeleteConfirm({isOpen, text, handlers}: AccountDeleteConfirmProps) {
  const {
    handlers: {signOut},
  } = useSession();
  const {
    isSettling,
    isFailed,
    handlers: {deleteAccount},
  } = useAccountDelete({
    deleteAccountApi: accountApi.deleteAccountApi,
    onDeleted: signOut,
    reportError: captureException,
  });

  return (
    <Confirm
      confirmLabel={text.confirm}
      content={text.content}
      failure={isFailed ? text.failure : undefined}
      handlers={{onCancel: handlers.onClose, onConfirm: deleteAccount}}
      loading={isSettling}
      open={isOpen}
      title={text.trigger}
    />
  );
}
