import type {
  PostAppTokenApiRequest,
  PostAppTokenApiResponse,
  PostAppTokenRefreshApiResponse,
} from '@plan-for-myself/shared';
import {apiClient} from '@/shared/api/client';

export async function postAppTokenApi(request: PostAppTokenApiRequest): Promise<PostAppTokenApiResponse> {
  return apiClient.post<PostAppTokenApiResponse>('/api/app-token', {body: request});
}

export async function postAppTokenRefreshApi(signal: AbortSignal): Promise<PostAppTokenRefreshApiResponse> {
  return apiClient.post<PostAppTokenRefreshApiResponse>('/api/app-token/refresh', {body: undefined, signal});
}
