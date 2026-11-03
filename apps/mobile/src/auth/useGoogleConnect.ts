import {useRef, useState} from 'react';
import {router} from 'expo-router';
import {captureException} from '@sentry/react-native';
import {getConnectOutcomeHref} from '@/auth/connect-outcome';
import {type GoogleConnectResult, useSession} from '@/auth/session-context';

export type GoogleConnectOutcome = GoogleConnectResult | 'failed';

interface UseGoogleConnectResult {
  isPending: boolean;
  handlers: {
    connect: () => Promise<GoogleConnectOutcome>;
    connectAndNavigate: () => Promise<void>;
    discardGuestAndConnect: () => Promise<GoogleConnectOutcome>;
  };
}

export default function useGoogleConnect(): UseGoogleConnectResult {
  const {
    handlers: {connectGoogle, discardGuestAndConnect},
  } = useSession();

  const [isPending, setIsPending] = useState(false);
  const isPendingCache = useRef(false);

  const run = async (task: () => Promise<GoogleConnectResult>): Promise<GoogleConnectOutcome> => {
    if (isPendingCache.current) {
      return 'cancelled';
    }

    isPendingCache.current = true;
    setIsPending(true);
    try {
      return await task();
    } catch (error) {
      captureException(error);
      return 'failed';
    } finally {
      isPendingCache.current = false;
      setIsPending(false);
    }
  };

  const connectAndNavigate = async () => {
    const href = getConnectOutcomeHref(await run(connectGoogle));
    if (href !== null) {
      router.push(href);
    }
  };

  return {
    isPending,
    handlers: {
      connect: () => run(connectGoogle),
      connectAndNavigate,
      discardGuestAndConnect: () => run(discardGuestAndConnect),
    },
  };
}
