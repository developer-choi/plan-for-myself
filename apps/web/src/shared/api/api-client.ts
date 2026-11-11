import {FetchApiClient, type RequestContext} from '@developer-choi/utils/api';
import {API_URL} from '@/shared/api/api-url';

/**
 * @param readAppToken undefined를 돌려주면 Authorization 없이 보낸다
 */
export function createApiClient(readAppToken: () => Promise<string | undefined>): FetchApiClient {
  return new FetchApiClient('', async () => toRequestContext(await readAppToken()));
}

export function toRequestContext(appToken: string | undefined): RequestContext {
  return {
    prefixUrl: API_URL,
    headers: appToken === undefined ? undefined : [['Authorization', `Bearer ${appToken}`]],
  };
}
