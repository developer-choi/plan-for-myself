export const DEFAULT_HOME_URL = '/studied-time';

/* 일반 로그인·SNS 로그인 등 로그인 수단이 달라도 같은 리다이렉트를 적용하려고 한 함수로 모은다 */
export function getRedirectUrlWhenLoginSuccess() {
  const redirectUrlFromQuery = new URLSearchParams(location.search).get('redirect') ?? DEFAULT_HOME_URL;
  const {pathname, search} = new URL(location.origin + redirectUrlFromQuery);
  return pathname + search;
}
