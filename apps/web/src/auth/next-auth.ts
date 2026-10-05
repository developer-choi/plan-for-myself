import NextAuth from 'next-auth';
import {NextResponse} from 'next/server';
import {decideGoogleLogin, findGoogleLoginFacts, type GoogleLoginParams, resolveGoogleLogin} from '@/auth/google-login';
import {authorizeGuest} from '@/auth/guest-login';
import {
  clearDiscardIntent,
  clearLoginCookies,
  isDiscardIntentValid,
  readDiscardIntent,
  setRegisteredRejection,
} from '@/auth/login-cookies';
import {getLoginState, getNextNavigating} from '@/auth/path';
import Credentials from 'next-auth/providers/credentials';
import Google, {type GoogleProfile} from 'next-auth/providers/google';
import {pool} from '@/server/db/pool';

const SECONDS_PER_DAY = 86_400;
const SESSION_MAX_AGE_DAYS = 30;
const GUEST_PROVIDER_ID = 'guest';

export const {handlers, signIn, signOut, auth} = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    maxAge: SESSION_MAX_AGE_DAYS * SECONDS_PER_DAY,
  },
  providers: [
    Google({
      authorization: {params: {scope: 'openid'}},
      profile: (profile: GoogleProfile) => ({id: profile.sub}),
    }),
    Credentials({
      id: GUEST_PROVIDER_ID,
      credentials: {},
      authorize: (_credentials, request) => authorizeGuest(request),
    }),
  ],
  callbacks: {
    signIn: async ({account}) => {
      if (account?.provider === GUEST_PROVIDER_ID || !account) {
        return true;
      }

      const params = await readGoogleLoginParams(account.providerAccountId);
      const facts = await findGoogleLoginFacts(params, pool);

      const isRejected = decideGoogleLogin(facts).type === 'reject';

      if (!isRejected || params.guestUserId === null) {
        return true;
      }

      await setRegisteredRejection(params.guestUserId, params.googleSub);
      await clearDiscardIntent();
      return '/login';
    },
    jwt: async ({token, account}) => {
      if (!account) {
        return token;
      }

      const isGuest = account.provider === GUEST_PROVIDER_ID;
      token.isGuest = isGuest;

      if (isGuest) {
        token.userId = account.providerAccountId;
        return token;
      }

      token.userId = await resolveGoogleLogin(await readGoogleLoginParams(account.providerAccountId));
      await clearLoginCookies();
      return token;
    },
    session: ({session, token}) => {
      return {...session, userId: token.userId, isGuest: token.isGuest};
    },
    authorized({auth, request: {nextUrl, url}}) {
      const nextNavigating = getNextNavigating({
        pathWithSearch: nextUrl.pathname + nextUrl.search,
        loginState: getLoginState(auth),
      });

      switch (nextNavigating.type) {
        case 'already-authenticated':
        case 'not-authenticated':
          return NextResponse.redirect(new URL(nextNavigating.nextUrl, url));
        case 'correct':
          return NextResponse.next();
      }
    },
  },
});

async function readGoogleLoginParams(googleSub: string): Promise<GoogleLoginParams> {
  const session = await auth();
  const guestUserId = session?.isGuest ? session.userId : null;

  if (guestUserId === null) {
    return {googleSub, guestUserId, discardIntentValid: false};
  }

  const discardIntentValid = isDiscardIntentValid(await readDiscardIntent(), {guestUserId, googleSub});
  return {googleSub, guestUserId, discardIntentValid};
}
