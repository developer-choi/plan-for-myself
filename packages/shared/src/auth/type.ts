import type {RegisteredAccountRejection} from './registered-rejection';

export interface AppTokenClaims {
  sub?: string;
  /** 없으면 Google 사용자 토큰이다 */
  isGuest?: boolean;
}

export interface PostAppTokenApiRequest {
  idToken: string;
  /** null: 게스트를 버리지 않는 일반 교환이다 */
  discardIntent: RegisteredAccountRejection | null;
}

export type PostAppTokenApiResponse =
  {type: 'session'; token: string} | {type: 'registered-account'; rejection: RegisteredAccountRejection};

export interface PostAppTokenGuestApiResponse {
  token: string;
}

export interface PostAppTokenRefreshApiResponse {
  token: string;
}
