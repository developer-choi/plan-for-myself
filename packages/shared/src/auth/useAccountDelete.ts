import {useMutation} from '@tanstack/react-query';
import {isMutationSettling} from '../query/mutation';
import type {AccountApi} from './api';

interface UseAccountDeleteParams extends Pick<AccountApi, 'deleteAccountApi'> {
  onDeleted: () => void | Promise<void>;
  reportError: (error: unknown) => void;
}

export default function useAccountDelete({deleteAccountApi, onDeleted, reportError}: UseAccountDeleteParams) {
  const deleteMutation = useMutation({mutationFn: deleteAccountApi});

  const deleteAccount = async () => {
    try {
      await deleteMutation.mutateAsync();
      await onDeleted();
    } catch (error) {
      reportError(error);
    }
  };

  return {
    isSettling: isMutationSettling(deleteMutation),
    isFailed: deleteMutation.isError,
    handlers: {deleteAccount},
  };
}
