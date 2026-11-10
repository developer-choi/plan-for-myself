import {
  createAccountApi,
  type PostAppTokenApiRequest,
  type PostAppTokenApiResponse,
  type PostAppTokenGuestApiResponse,
  type PostAppTokenRefreshApiResponse,
} from '@plan-for-myself/shared';
import {apiClient} from '@/shared/api/client';

export const accountApi = createAccountApi(apiClient);

export async function postAppTokenApi(request: PostAppTokenApiRequest): Promise<PostAppTokenApiResponse> {
  return apiClient.post<PostAppTokenApiResponse>('/api/app-token', {body: request});
}

export async function postAppTokenGuestApi(signal: AbortSignal): Promise<PostAppTokenGuestApiResponse> {
  return apiClient.post<PostAppTokenGuestApiResponse>('/api/app-token/guest', {body: undefined, signal});
}

export async function postAppTokenRefreshApi(signal: AbortSignal): Promise<PostAppTokenRefreshApiResponse> {
  return apiClient.post<PostAppTokenRefreshApiResponse>('/api/app-token/refresh', {body: undefined, signal});
}
