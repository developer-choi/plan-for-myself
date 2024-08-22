import {Session} from "next-auth";
import {getSession, signOut} from 'next-auth/react';
import {redirect} from 'next/navigation';
import {LoginError} from '@/utils/service/auth/redirect';
import {auth} from '@/utils/service/auth';

/** customFetchOnXXXSide() 공통 주석
 * @throws LoginError 세션정보가 없는 상태로 API를 호출하려고 시도하거나, API에서 401에러가 응답된 경우 발생
 */

export async function customFetchOnClientSide(input: string | URL | globalThis.Request, parameter: ExtendedCustomFetchParameter) {
  try {
    const session = await getSession();
    return await customFetchInBothSide(input, {...parameter, session});
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
  try {
    const session = await auth();
    return await customFetchInBothSide(input, {...parameter, session});
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

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
interface ExtendedCustomFetchParameter extends Omit<RequestInit, 'body'> {
  body?: RequestInit['body'] | object;
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
  query?: Record<string, string | string[] | boolean | number | null | undefined>;

  /**
   * none = request에 accessToken을 싣지않음.
   * public = 로그인되어있으면 accessToken을 request에 실음
   * private = public 특징 포함하며, 로그인 안되어있으면 LoginError 던짐
   */
  authorize: 'private' | 'public' | 'none';
}

interface CustomFetchParameter extends ExtendedCustomFetchParameter {
  session: Session | null;
}

async function customFetchInBothSide(input: string | URL | globalThis.Request, parameter: CustomFetchParameter) {
  const request = handleRequest(input, parameter);
  const response = await fetch(request.input, request.init);
  return handleResponse(response);
}

function handleRequest(input: string | URL | globalThis.Request, parameter: CustomFetchParameter) {
  const {headers, session, authorize, body, query, ...init} = parameter;
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

  // TODO URL 앞에 env로 개발환경 / 운영환경 셋팅하는부분은 추후 추가
  let requestUrl = typeof input !== "string" || input.startsWith("http") ? input : `${process.env.NEXT_PUBLIC_FRONT_ORIGIN}${input}`;

  if (query) {
    const newQuery = Object.fromEntries(Object.entries(query).map(([key, value]) => [key, String(value)]));
    requestUrl += `?${new URLSearchParams(newQuery).toString()}`
  }

  return {
    input: requestUrl,
    init: {
      headers: newHeaders,
      body: typeof body === "object" ? JSON.stringify(body) : body,
      ...init
    }
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
    return Promise.reject(customResponse);
  }
}

const LOGIN_ERROR = new LoginError("Login is required");
