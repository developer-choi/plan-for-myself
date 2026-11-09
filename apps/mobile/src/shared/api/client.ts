import {FetchApiClient, type RequestContext} from '@developer-choi/utils/api';
import {getAppToken} from '@/auth/app-token-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export const apiClient = new FetchApiClient(API_URL, resolveRequestContext);

async function resolveRequestContext(): Promise<RequestContext> {
  const token = await getAppToken();
  return {
    prefixUrl: API_URL,
    headers: token ? [['Authorization', `Bearer ${token}`]] : undefined,
  };
}
