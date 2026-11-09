import {apiClient} from '@/shared/api/client';

export async function deleteAccountApi(): Promise<void> {
  return apiClient.delete<void>('/api/account');
}
