import type {
  PostAppTokenApiRequest,
  PostAppTokenApiResponse,
  PostAppTokenRefreshApiResponse,
} from '@plan-for-myself/shared';
import {api} from '@/shared/api/client';

export async function postAppTokenApi(request: PostAppTokenApiRequest): Promise<PostAppTokenApiResponse> {
  return api.post<PostAppTokenApiResponse>('/api/app-token', {body: request});
}

export async function postAppTokenRefreshApi(signal: AbortSignal): Promise<PostAppTokenRefreshApiResponse> {
  return api.post<PostAppTokenRefreshApiResponse>('/api/app-token/refresh', {body: undefined, signal});
}
