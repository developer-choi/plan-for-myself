import {Session} from 'next-auth';
import {LoginError} from '@/util/sevices/auth/redirect';

export async function customFetchInBothSide(input: string | URL | globalThis.Request, parameter: CustomFetchParameter) {
  const request = handleRequest(input, parameter);
  const response = await fetch(request.input, request.init);
  return handleResponse(response);
}

function handleRequest(input: string | URL | globalThis.Request, parameter: CustomFetchParameter) {
  const {headers, session, authorize, body, ...init} = parameter;
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

  const requestUrl = typeof input !== "string" || input.startsWith("http") ? input : `${process.env.NEXT_PUBLIC_FRONT_ORIGIN}${input}`;

  return {
    input: requestUrl,
    init: {
      headers: newHeaders,
      body: typeof body === "object" ? JSON.stringify(body) : body,
      ...init
    }
  }
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

// Client Side / Server Side 각 환경에서 한번 더 확장한 fetch 함수 만들 때 이 타입을 사용
export interface ExtendedCustomFetchParameter extends Omit<RequestInit, 'body'> {
  body?: RequestInit['body'] | object;
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';

  /**
   * none = request에 accessToken을 싣지않음.
   * public = 로그인되어있으면 accessToken을 request에 실음
   * private = public 특징 포함하며, 로그인 안되어있으면 LoginError 던짐
   */
  authorize: 'private' | 'public' | 'none';
}

export interface CustomFetchParameter extends ExtendedCustomFetchParameter {
  session: Session | null;
}

export interface CustomResponse extends Pick<Response, 'status' | 'headers' | 'url'> {
  json: any; // TODO 추후 제네릭 추가예정
  text: string | '';
}

const LOGIN_ERROR = new LoginError("Login is required");
