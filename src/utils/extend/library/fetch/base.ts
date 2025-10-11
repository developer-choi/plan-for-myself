import {Session} from 'next-auth';
import {AlreadyLoggedInError, BaseApi, BaseApiRequest, NotAuthenticatedError} from '@forworkchoe/core/utils';

export interface FetchOptions extends BaseApiRequest {
  /**
   * optional = request에 accessToken을 싣긴함. (로그인이 되어있는 경우 한정) ==> 예시로 상품리스트&상세 페이지에서 상품의 좋아요 여부 응답하는 API의 경우 필요.
   * none = request에 accessToken을 싣지않음. ==> Static Build 해야하는 페이지의 경우 사용
   * guest = request에 accessToken을 싣지않음. + 로그인이 되어있으면 AlreadyLoggedInError를 던짐
   * private = request에 accessToken을 포함함 + 로그인 안되어있으면 LoginError 던짐
   */
  authPolicy: 'none' | 'optional' | 'guest' | 'private';

  next?: RequestInit['next'] & {
    tags?: string[]
  };
}

/** @deprecated
 * authPolicy none으로 client / server side 어디에서나 호출하기 위한 함수.
 * 그래서 로그인 체크도 하지않고,
 * 로그인이 실패할 일도 없어서 로그인 실패 처리로직도 없음.
 */
export async function customFetchOnBothSide<D>(input: string, options: Omit<FetchOptions, 'authPolicy'>) {
  return customFetch<D>(input, {...options, authPolicy: 'none'}, null);
}

/**
 * @throws {AlreadyLoggedInError}
 * @throws {ApiRequestError}
 * @throws {ApiResponseError}
 * @throws {NotAuthenticatedError}
 * @throws {MismatchedApiResponseError}
 */
export async function customFetch<D>(input: string, options: FetchOptions, session: Session | null) {
  const {headers, authPolicy, cache, ...rest} = options;
  const newHeaders = new Headers(headers);
  const isPrivate = authPolicy === 'private';

  if (isPrivate && !session) {
    throw new NotAuthenticatedError('Login is required');
  }

  if (authPolicy === 'guest' && session) {
    throw new AlreadyLoggedInError();
  }

  if (authPolicy !== 'none' && session) {
    // access token 대신
    newHeaders.set("User-Id", session.user.email);
  }

  return await baseApi.request<D>(input, {
    ...rest,
    cache: cache === undefined && authPolicy === 'none' ? 'force-cache' : cache,
    headers: newHeaders
  });
}

const baseApi = new BaseApi(process.env.NEXT_PUBLIC_ORIGIN as string);
