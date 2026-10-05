import {FetchApiClient, type RequestContext} from '@developer-choi/utils/api';

export const api = new FetchApiClient('', resolveRequestContext);

export interface ServerRequestSource {
  /* 받은 요청에 쿠키 헤더가 없으면(로그인 전 등) null */
  cookie: string | null;
  host: string;
  protocol: 'http' | 'https';
}

export function buildServerRequestContext(source: ServerRequestSource): RequestContext {
  const {cookie, host, protocol} = source;
  return {
    prefixUrl: `${protocol}://${host}`,
    headers: cookie ? [['Cookie', cookie]] : undefined,
  };
}

async function resolveRequestContext(): Promise<RequestContext> {
  if (typeof window !== 'undefined') {
    return {prefixUrl: window.location.origin};
  }

  const {headers} = await import('next/headers');
  const requestHeaders = await headers();
  const host = requestHeaders.get('host');

  if (!host) {
    throw new Error('요청에 host 헤더가 없어 서버 요청 주소를 만들 수 없다');
  }

  return buildServerRequestContext({
    cookie: requestHeaders.get('cookie'),
    host,
    protocol: requestHeaders.get('x-forwarded-proto')?.split(',')[0].trim() === 'https' ? 'https' : 'http',
  });
}
