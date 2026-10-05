import {api} from '@/shared/api/client';

export async function deleteAccountApi(): Promise<void> {
  return api.delete<void>('/api/account');
}
