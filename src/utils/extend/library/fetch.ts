import {Session} from "next-auth";
import {getSession, signOut} from 'next-auth/react';
import {redirect} from 'next/navigation';
import {LoginError} from '@/utils/service/auth/redirect';
import {auth} from '@/utils/service/auth';
import {isServer} from '@/utils/extend/library/next';
import {InvalidEnvironmentError} from '@/utils/service/error/both-side';
import {ConvertableQuery, stringifyQuery} from '@/utils/extend/browser/query-string/convert';
import {ValueOf} from 'next/constants';

/** customFetchOnXXXSide() 공통 주석
 * @throws LoginError 세션정보가 없는 상태로 API를 호출하려고 시도하거나, API에서 401에러가 응답된 경우 발생
 */

export async function customFetchOnClientSide(input: string | URL | globalThis.Request, parameter: ExtendedCustomFetchParameter) {
  if(isServer()) {
    throw new InvalidEnvironmentError('customFetchOnClientSide()는 Server Side에서 호출되면 안됩니다.');
  }

  try {
    const session = await getSession();
    return await customFetch(input, {...parameter, session});
  } catch (error: any) {
    if (error instanceof LoginError) {
      const redirectUrl = location.pathname + location.search;

      await signOut({
        redirect: false
      });

      throw new LoginError("Login is required", `/guest/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      throw error;
    }
  }
}

export async function customFetchOnServerSide(input: string | URL | globalThis.Request, parameter: ExtendedCustomFetchParameter) {
  if(!isServer()) {
    throw new InvalidEnvironmentError('customFetchOnServerSide()는 Client Side에서 호출되면 안됩니다.');
  }

  try {
    const session = await auth();
    return await customFetch(input, {...parameter, session});
  } catch (error: any) {
    if (error instanceof LoginError) {
      const currentUrl = require('next/headers').headers().get('current-pathname-with-search') ?? '/'; // middleware에서 셋팅
      redirect(`/api/next-auth/logout?redirect=${currentUrl}`);

    } else {
      throw error;
    }
  }
}

export interface CustomResponse extends Pick<Response, 'status' | 'headers' | 'url'> {
  json: any; // TODO 추후 제네릭 추가예정
  text: string | '';
}

export const REVALIDATE_TAG = {
  PROCESSABLE_ROUTINE_LIST: 'PROCESSABLE_ROUTINE_LIST' as const
};

export type RevalidateTagType = ValueOf<typeof REVALIDATE_TAG>;

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
interface ExtendedCustomFetchParameter extends Omit<RequestInit, 'body'> {
  body?: RequestInit['body'] | object;
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
  query?: ConvertableQuery;

  /**
   * none = request에 accessToken을 싣지않음.
   * public = 로그인되어있으면 accessToken을 request에 실음
   * private = public 특징 포함하며, 로그인 안되어있으면 LoginError 던짐
   * guest = 로그인이 되어있으면 GuestError를 던짐
   */
  authorize: 'private' | 'public' | 'none' | 'guest';

  next?: RequestInit['next'] & {
    tags?: RevalidateTagType[]
  };

  // cache ==> authorize 가 private이면, "기본" no-store로 설정됨. 로그인 해야만 얻을 수 있는 정보는 대부분 API 호출 시점에 최신화된 데이터가 필요한 경우가 많았음.
}

interface CustomFetchParameter extends ExtendedCustomFetchParameter {
  session: Session | null;
}

/** customFetch() 공통 주석
 * @throws LoginError 세션정보가 없는 상태로 API를 호출하려고 시도하거나, API에서 401에러가 응답된 경우 발생
 */
async function customFetch(input: string | URL | globalThis.Request, parameter: CustomFetchParameter) {
  const request = handleRequest(input, parameter);
  const response = await fetch(request.input, request.init);
  return handleResponse(response);
}

function handleRequest(input: string | URL | globalThis.Request, parameter: CustomFetchParameter) {
  const {headers, session, authorize, body, query, cache,  ...rest} = parameter;
  const newHeaders = new Headers(headers);

  if (authorize === 'private' && !session) {
    throw LOGIN_ERROR;

  } else if (authorize !== 'none' && session) {
    // access token 대신
    newHeaders.set("User-Id", session.user.email);
  }

  // GET의 경우에는 없고, 그 외 나머지는 JSON이 될 수도, Primitive일 수도 있음.
  if (typeof body === "object") {
    newHeaders.set("Content-Type", "application/json");
  }

  let requestUrl = typeof input !== "string" || input.startsWith("http") ? input : `${process.env.NEXT_PUBLIC_ORIGIN}${input}`;
  requestUrl += stringifyQuery(query);

  const init: RequestInit = {
    headers: newHeaders,
    body: typeof body === "object" ? JSON.stringify(body) : body,
    cache: (cache === undefined && authorize === 'private') ? 'no-store' : cache,
    ...rest
  };

  return {
    input: requestUrl,
    init,
  };
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get("Content-Type");
  let json = {};
  let text = '';

  if (contentType && contentType.includes("application/json")) {
    json = await response.json();
  } else {
    text = await response.text();
  }

  const customResponse: CustomResponse = {
    status: response.status,
    url: response.url,
    headers: response.headers,
    json,
    text
  };

  if (response.ok) {
    return customResponse;

  } else if (response.status === 401) {
    throw LOGIN_ERROR;

  } else {
    console.error(customResponse);
    return Promise.reject(customResponse);
  }
}

const LOGIN_ERROR = new LoginError("Login is required");
