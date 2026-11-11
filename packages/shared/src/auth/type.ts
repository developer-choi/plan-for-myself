export interface AppTokenClaims {
  sub?: string;
  /** 없으면 Google 사용자 토큰이다 */
  isGuest?: boolean;
}

export interface PostAppTokenGuestApiResponse {
  token: string;
}

export interface PostAppTokenRefreshApiResponse {
  token: string;
}
