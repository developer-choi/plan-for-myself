import type {ApiClient} from '@developer-choi/utils/api';

export type AccountApi = ReturnType<typeof createAccountApi>;

export function createAccountApi(apiClient: ApiClient) {
  return {
    deleteAccountApi: (): Promise<void> => apiClient.delete<void>('/api/account'),
  };
}
