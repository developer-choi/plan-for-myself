import {BodyInit} from 'undici-types';
import {LoginError, Session} from '@util/sevices/auth';

export async function getCustomFetchInBothSide(input: string | URL | globalThis.Request, parameter: GetFetchParameter): Promise<CustomResponse> {
  const request = handleRequest(input, parameter);
  const response = await fetch(request.input, request.init);
  return handleResponse(response);
}

export async function othersCustomFetch(input: string | URL | globalThis.Request, parameter: OthersFetchParameter) {
  const request = handleRequest(input, parameter);
  const response = await fetch(request.input, request.init);
  return handleResponse(response);
}

function handleRequest(input: string | URL | globalThis.Request, parameter: GetFetchParameter) {
  const {headers, session, body, ...init} = parameter;
  const newHeaders = new Headers(headers);

  if (session?.userId !== 'forworkchoe@gmail.com') {
    throw LOGIN_ERROR;
  } else {
    newHeaders.set("User-Id", session.userId);
  }

  if (typeof body === "object") {
    newHeaders.set("Content-Type", "application/json");
  }

  const requestUrl = typeof input !== "string" || input.startsWith("http") ? input : `${process.env.NEXT_PUBLIC_FRONT_ORIGIN}/${input}`;

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

export interface GetFetchParameter extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null | object;
  session: Session | null;
}

export interface OthersFetchParameter extends GetFetchParameter {
  method: "POST" | "DELETE" | "PATCH";
}

export interface CustomResponse extends Pick<Response, 'status' | 'headers' | 'url'> {
  json: any; // TODO 추후 제네릭 추가예정
  text: string | '';
}

const LOGIN_ERROR = new LoginError("Login is required");
