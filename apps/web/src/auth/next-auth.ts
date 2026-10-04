import NextAuth from 'next-auth';
import {NextResponse} from 'next/server';
import {getNextNavigating} from '@/auth/path';
import Google, {type GoogleProfile} from 'next-auth/providers/google';
import {findOrCreateUserId} from '@/server/user/repository';

const SECONDS_PER_DAY = 86_400;
const SESSION_MAX_AGE_DAYS = 30;

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
  ],
  callbacks: {
    jwt: async ({token, account}) => {
      if (account) {
        token.userId = await findOrCreateUserId(account.providerAccountId);
      }

      return token;
    },
    session: ({session, token}) => {
      return {...session, userId: token.userId};
    },
    authorized({auth, request: {nextUrl, url}}) {
      const isLoggedIn = !!auth?.userId;

      const nextNavigating = getNextNavigating({
        pathWithSearch: nextUrl.pathname + nextUrl.search,
        isLoggedIn,
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
