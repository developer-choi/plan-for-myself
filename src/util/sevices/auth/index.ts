import NextAuth from 'next-auth';
import {NextResponse} from 'next/server';
import {getNextNavigating} from '@/util/sevices/auth/path';
import Google from '@auth/core/providers/google';

export const {handlers, signOut, auth} = NextAuth({
  pages: {
    signIn: '/guest/login',
    error: '/guest/login'
  },
  session: {
    maxAge: 60 * 60 * 24 // 단위 : second
  },
  providers: [Google],
  callbacks: {
    signIn: function (params) {
      return ALLOW_ACCOUNT_LIST.includes(params.user.email as any);
    },
    jwt: async ({token, user, trigger}) => {
      if (trigger === 'signIn') {
        token.user = user;
      }

      return token;
    },
    session: async ({session, token}) => {
      session.user = token.user;
      return session;
    },
    authorized({auth, request: {headers, nextUrl, url}}) {
      const isLoggedIn = !!auth?.user;

      const nextNavigating = getNextNavigating({
        nextPathname: nextUrl.pathname,
        isLoggedIn,
        redirectUrl: nextUrl.pathname + nextUrl.search
      });

      switch (nextNavigating.type) {
        case 'already-authenticated':
        case 'not-authenticated':
          return NextResponse.redirect(new URL(nextNavigating.nextUrl, url));
        default: {
          // https://www.propelauth.com/post/getting-url-in-next-server-components
          const newHeaders = new Headers(headers);
          newHeaders.set(CURRENT_URL_IN_HEADER, nextUrl.pathname + nextUrl.search);
          return NextResponse.next({headers: newHeaders});
        }
      }
    },
  },
});

export const CURRENT_URL_IN_HEADER = 'current-pathname-with-search';

const ALLOW_ACCOUNT_LIST = [
  'forworkchoe@gmail.com'
];
