import NextAuth from 'next-auth';
import {NextResponse} from 'next/server';
import {getLoginState, getNextNavigating} from '@/auth/path';
import Credentials from 'next-auth/providers/credentials';
import Google, {type GoogleProfile} from 'next-auth/providers/google';
import {createGuestUserId, findOrCreateUserId} from '@/server/user/repository';

const SECONDS_PER_DAY = 86_400;
const SESSION_MAX_AGE_DAYS = 30;
const GUEST_PROVIDER_ID = 'guest';

export const {handlers, signOut, auth} = NextAuth({
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
      authorize: async () => ({id: await createGuestUserId()}),
    }),
  ],
  callbacks: {
    jwt: async ({token, account}) => {
      if (account) {
        const isGuest = account.provider === GUEST_PROVIDER_ID;
        token.userId = isGuest ? account.providerAccountId : await findOrCreateUserId(account.providerAccountId);
        token.isGuest = isGuest;
      }

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
