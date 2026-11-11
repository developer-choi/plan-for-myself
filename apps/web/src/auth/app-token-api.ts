import {FetchApiClient} from '@developer-choi/utils/api';
import type {
  PostAppTokenApiRequest,
  PostAppTokenApiResponse,
  PostAppTokenGuestApiResponse,
  PostAppTokenRefreshApiResponse,
} from '@plan-for-myself/shared/auth';
import {API_URL} from '@/shared/api/api-url';

/**
 * @param guestAppToken 게스트 세션의 앱 토큰. 게스트가 아니면 null
 */
export function postAppTokenApi(
  request: PostAppTokenApiRequest,
  guestAppToken: string | null,
): Promise<PostAppTokenApiResponse> {
  return postApiServer<PostAppTokenApiResponse>('/api/app-token', request, guestAppToken);
}

export function postAppTokenGuestApi(): Promise<PostAppTokenGuestApiResponse> {
  return postApiServer<PostAppTokenGuestApiResponse>('/api/app-token/guest', undefined, null);
}

export function postAppTokenRefreshApi(appToken: string): Promise<PostAppTokenRefreshApiResponse> {
  return postApiServer<PostAppTokenRefreshApiResponse>('/api/app-token/refresh', undefined, appToken);
}

const API_SERVER_TIMEOUT_MS = 5000;

function postApiServer<T>(url: string, body: unknown, bearerToken: string | null): Promise<T> {
  const client = new FetchApiClient('', () =>
    Promise.resolve({
      prefixUrl: API_URL,
      headers: bearerToken === null ? undefined : [['Authorization', `Bearer ${bearerToken}`]],
    }),
  );
  return client.post<T>(url, {body, signal: AbortSignal.timeout(API_SERVER_TIMEOUT_MS)});
}
