import NextAuth from 'next-auth';
import {NextResponse} from 'next/server';
import {getNextNavigating} from '@/utils/service/auth/path';
import Google from 'next-auth/providers/google';

/**
 * [Next Auth Overview] https://docs.google.com/document/d/1PYKKPneIYB8j8vz8fQgqwBLAkEmB69KJfeFTSXhtdbk/edit#heading=h.mkk12las5ndq
 * [Next Auth auth.ts] https://docs.google.com/document/d/1w0Kn91aacGsdKFPTxsdM3JsyRzKynTR4kgJzyS3rcbY/edit#heading=h.14tqv65n973
 */
export const {handlers, signOut, auth} = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/guest/login',
    error: '/guest/login',
  },
  session: {
    maxAge: 60 * 60 * 24 * 30, // 단위 : second
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
      return {...session, user: token.user};
    },
    authorized({auth, request: {nextUrl, url}}) {
      const isLoggedIn = !!auth?.user;

      const nextNavigating = getNextNavigating({
        nextUrl: nextUrl.pathname + nextUrl.search,
        isLoggedIn,
      });

      switch (nextNavigating.type) {
        case 'already-authenticated':
        case 'not-authenticated':
          return NextResponse.redirect(new URL(nextNavigating.nextUrl, url));
        default:
          return NextResponse.next();
      }
    },
  },
});

const ALLOW_ACCOUNT_LIST = ['forworkchoe@gmail.com'];
