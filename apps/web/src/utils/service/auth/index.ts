import NextAuth from 'next-auth';
import {NextResponse} from 'next/server';
import {getNextNavigating} from '@/utils/service/auth/path';
import Google from 'next-auth/providers/google';

const SECONDS_PER_DAY = 86_400;
const SESSION_MAX_AGE_DAYS = 30;

export const {handlers, signOut, auth} = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/guest/login',
    error: '/guest/login',
  },
  session: {
    maxAge: SESSION_MAX_AGE_DAYS * SECONDS_PER_DAY,
  },
  providers: [Google],
  callbacks: {
    signIn: function (params) {
      const {email} = params.user;
      return typeof email === 'string' && ALLOW_ACCOUNT_LIST.includes(email);
    },
    jwt: ({token, user, trigger}) => {
      if (trigger === 'signIn') {
        token.user = user;
      }

      return token;
    },
    session: ({session, token}) => {
      return {...session, user: token.user};
    },
    authorized({auth, request: {nextUrl, url}}) {
      const isLoggedIn = !!auth?.user;

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

const ALLOW_ACCOUNT_LIST = ['forworkchoe@gmail.com'];
