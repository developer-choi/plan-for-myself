import {DefaultSession, Session, User} from 'next-auth';
import {NextRequest} from 'next/server';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User;
  }
}

declare module 'next-auth' {
  interface NextAuthRequest extends NextRequest {
    auth: Session | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    user: User;
  }
}
