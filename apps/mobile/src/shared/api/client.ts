import {ApiClient, FetchApiClient, type FetchOptions} from '@developer-choi/utils/api';
import {getAppToken} from '@/auth/app-token-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

/**
 * null: 토큰 없이 보낸 요청의 오류다
 * undefined: 이 클라이언트가 보낸 요청의 오류가 아니다
 */
export function readSentToken(error: unknown): string | null | undefined {
  return typeof error === 'object' && error !== null ? sentTokenByError.get(error) : undefined;
}

/**
 * @param readToken null: 저장된 토큰이 없다
 */
export async function sendWithAppToken<T>(
  readToken: () => Promise<string | null>,
  send: (client: FetchApiClient) => Promise<T>,
): Promise<T> {
  const token = await readToken();
  /* 토큰을 요청 옵션 헤더로 넘기면 오류의 headers에 실려 Sentry로 넘어가므로, 요청마다 그 토큰만 읽는 클라이언트를 만든다 */
  const client = new FetchApiClient(API_URL, () =>
    Promise.resolve({
      prefixUrl: API_URL,
      headers: token ? [['Authorization', `Bearer ${token}`]] : undefined,
    }),
  );

  try {
    return await send(client);
  } catch (error) {
    if (typeof error === 'object' && error !== null) {
      sentTokenByError.set(error, token);
    }
    throw error;
  }
}

const sentTokenByError = new WeakMap<object, string | null>();

/* ApiClient를 상속해, 메서드 하나라도 빠지면 토큰 없이 나가는 대신 컴파일이 실패하게 한다 */
class AppApiClient extends ApiClient {
  constructor() {
    super(API_URL);
  }

  get<T>(url: string, options?: FetchOptions): Promise<T> {
    return sendWithAppToken(getAppToken, (client) => client.get<T>(url, options));
  }

  post<T>(url: string, options: FetchOptions & {body: unknown}): Promise<T> {
    return sendWithAppToken(getAppToken, (client) => client.post<T>(url, options));
  }

  put<T>(url: string, options: FetchOptions & {body: unknown}): Promise<T> {
    return sendWithAppToken(getAppToken, (client) => client.put<T>(url, options));
  }

  patch<T>(url: string, options: FetchOptions & {body: unknown}): Promise<T> {
    return sendWithAppToken(getAppToken, (client) => client.patch<T>(url, options));
  }

  delete<T>(url: string, options?: FetchOptions): Promise<T> {
    return sendWithAppToken(getAppToken, (client) => client.delete<T>(url, options));
  }
}

export const apiClient = new AppApiClient();
