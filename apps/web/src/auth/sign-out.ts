import {signOut} from 'next-auth/react';

export function signOutAndReplace(url: string) {
  void signOut({redirect: false}).then(() => window.location.replace(url));
}
