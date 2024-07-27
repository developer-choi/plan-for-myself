export class LoginError extends Error {
  readonly loginUrlWithRedirect: string; // 로그인페이지 URL에 리다이랙트 URL까지 포함된 값 ex: /guest/login?redirect=...

  constructor(message: string, loginUrlWithRedirect = '/') {
    super(message);
    this.loginUrlWithRedirect = loginUrlWithRedirect;
  }
}

export const DEFAULT_HOME_URL = '/';

/**
 * 로그인 성공했을 때 리다이랙트 될 URL (pathname + search) 반환
 * 쿼리스트링에 인코딩이 되어있다면 디코딩 거쳐서 반환
 * 일반로그인 / SNS로그인 등 다양한 로그인 수단에 대해 동일한 리다이랙트 로직을 적용하기위함
 * Doc : https://docs.google.com/document/d/1wN_e6Dk1ix1En50c2xQ8upZ5p50KfyjBiw1sCZiwAUc/edit#heading=h.yu0aeefna63t
 */
export function getRedirectUrlWhenLoginSuccess() {
  const redirectUrlFromQuery = new URLSearchParams(location.search).get('redirect') ?? DEFAULT_HOME_URL;
  const {pathname, search} = new URL(location.origin + redirectUrlFromQuery);
  return pathname + search;
}
