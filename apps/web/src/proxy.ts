import {NextAuthRequest} from 'next-auth';
import {auth} from '@/utils/service/auth';

export const proxy = auth((_: NextAuthRequest) => {
  // additional proxy logic
});

// https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
