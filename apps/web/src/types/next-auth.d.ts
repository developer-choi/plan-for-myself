import {DefaultSession} from 'next-auth';
import {NextRequest} from 'next/server';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    userId: string;
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
  }
}
