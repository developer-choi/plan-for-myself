import {DefaultSession} from 'next-auth';
import {NextRequest} from 'next/server';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    userId: string;
    isGuest: boolean;
    /** 앱 토큰 없는 JWT로 session 콜백이 불릴 때 없다 */
    appToken?: string;
  }

  interface User {
    /** 로그인 흐름 밖(세션 조회 등)에서는 없다 */
    appToken?: string;
  }
}

declare module 'next-auth' {
  interface NextAuthRequest extends NextRequest {
    auth: Session | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    userId: string;
    isGuest: boolean;
    /** 전환 전에 만든 세션이면 없다 */
    appToken?: string;
    /** 밀리초 UNIX 시각. 토큰 갱신이 401이 아닌 이유로 실패했을 때만 있다 */
    refreshRetryAt?: number;
  }
}
