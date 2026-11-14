import {signOut} from 'next-auth/react';

export async function signOutAndReplace(url: string): Promise<void> {
  await signOut({redirect: false});
  window.location.replace(url);
}
