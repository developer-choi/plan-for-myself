export interface Session {
  userId: string;
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function getSession(): Session | null {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    return null;
  } else {
    return {
      userId
    };
  }
}
