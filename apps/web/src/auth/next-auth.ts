import {ApiResponseError} from '@developer-choi/utils/api';
import {GUEST_LIMIT_CODE, hasGuestLimitCode} from '@plan-for-myself/shared/auth';
import {ImpossibleStateError, isUnauthorizedError} from '@plan-for-myself/shared/error';
import {captureException} from '@sentry/nextjs';
import NextAuth, {CredentialsSignin, type User} from 'next-auth';
import {NextResponse} from 'next/server';
import {postAppTokenApi, postAppTokenGuestApi, postAppTokenRefreshApi} from '@/auth/app-token-api';
import {
  getRefreshRetryAt,
  isRefreshRetryWaiting,
  readAppTokenClaims,
  shouldRefreshAppToken,
} from '@/auth/app-token-session';
import {clearDiscardIntent, clearLoginCookies, readDiscardIntent, setRegisteredRejection} from '@/auth/login-cookies';
import {getLoginState, getNextNavigating} from '@/auth/path';
import {SESSION_MAX_AGE_SECONDS} from '@/auth/session-max-age';
import Credentials from 'next-auth/providers/credentials';
import Google, {type GoogleProfile} from 'next-auth/providers/google';

const GUEST_PROVIDER_ID = 'guest';

export const {handlers, signIn, signOut, auth} = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  providers: [
    Google({
      authorization: {params: {scope: 'openid'}},
      profile: (profile: GoogleProfile) => ({id: profile.sub}),
    }),
    Credentials({
      id: GUEST_PROVIDER_ID,
      credentials: {},
      authorize: async () => {
        try {
          const {token: appToken} = await postAppTokenGuestApi();
          return {id: readAppTokenClaims(appToken).userId, appToken};
        } catch (error) {
          if (error instanceof ApiResponseError && hasGuestLimitCode(error.errorData)) {
            throw new GuestLimitSignin();
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    signIn: async ({user, account}) => {
      if (account?.provider === GUEST_PROVIDER_ID || !account) {
        return true;
      }

      if (typeof account.id_token !== 'string') {
        throw new ImpossibleStateError('Google 로그인 응답에 id_token이 없다');
      }

      const session = await auth();
      const guestAppToken = session?.isGuest && session.appToken ? session.appToken : null;
      const discardIntent = guestAppToken === null ? null : await readDiscardIntent();

      const exchange = await postAppTokenApi({idToken: account.id_token, discardIntent}, guestAppToken);

      if (exchange.type === 'registered-account') {
        await setRegisteredRejection(exchange.rejection);
        await clearDiscardIntent();
        return '/login';
      }

      user.appToken = exchange.token;
      return true;
    },
    jwt: async ({token, user, account}) => {
      if (account) {
        const appToken = readUserAppToken(user);
        const claims = readAppTokenClaims(appToken);
        token.appToken = appToken;
        token.userId = claims.userId;
        token.isGuest = claims.isGuest;
        if (account.provider !== GUEST_PROVIDER_ID) {
          await clearLoginCookies();
        }
        return token;
      }

      if (!token.appToken) {
        return null;
      }

      if (isRefreshRetryWaiting(token.refreshRetryAt) || !shouldRefreshAppToken(token.appToken)) {
        return token;
      }

      try {
        const {token: next} = await postAppTokenRefreshApi(token.appToken);
        return {...token, appToken: next, refreshRetryAt: undefined};
      } catch (error) {
        if (isUnauthorizedError(error)) {
          return null;
        }
        captureException(error);
        return {...token, refreshRetryAt: getRefreshRetryAt()};
      }
    },
    session: ({session, token}) => {
      return {...session, userId: token.userId, isGuest: token.isGuest, appToken: token.appToken};
    },
    authorized({auth, request: {nextUrl, url}}) {
      const nextNavigating = getNextNavigating({
        pathWithSearch: nextUrl.pathname + nextUrl.search,
        loginState: getLoginState(auth),
      });

      switch (nextNavigating.type) {
        case 'entry':
        case 'already-authenticated':
        case 'not-authenticated':
          return NextResponse.redirect(new URL(nextNavigating.nextUrl, url));
        case 'correct':
          return NextResponse.next();
      }
    },
  },
});

class GuestLimitSignin extends CredentialsSignin {
  code = GUEST_LIMIT_CODE;
}

function readUserAppToken(user: User | undefined): string {
  if (!user?.appToken) {
    throw new ImpossibleStateError('로그인 흐름에서 앱 토큰을 받지 못했다');
  }
  return user.appToken;
}
