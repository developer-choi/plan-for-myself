import {useRef, useState} from 'react';
import LoginSection from '@/auth/components/LoginSection';
import {useSession} from '@/auth/session-context';

export default function SignInScreen() {
  const {
    handlers: {signIn},
  } = useSession();

  const [isPending, setIsPending] = useState(false);
  const isPendingCache = useRef(false);
  const [isFailed, setIsFailed] = useState(false);

  const handleSignIn = async () => {
    if (isPendingCache.current) {
      return;
    }

    isPendingCache.current = true;
    setIsPending(true);
    try {
      await signIn();
      setIsFailed(false);
    } catch {
      setIsFailed(true);
    } finally {
      isPendingCache.current = false;
      setIsPending(false);
    }
  };

  return <LoginSection handlers={{onSignIn: handleSignIn}} isFailed={isFailed} isPending={isPending} />;
}
