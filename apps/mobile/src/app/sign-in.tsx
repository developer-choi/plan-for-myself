import {useRef, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {captureException} from '@sentry/react-native';
import {INTRO_URL} from '@plan-for-myself/shared/intro';
import {type LoginFailure, shouldShowRegisteredNotice} from '@plan-for-myself/shared/auth';
import GuestConnectSection from '@/auth/components/GuestConnectSection';
import LoginSection, {type PendingAction} from '@/auth/components/LoginSection';
import {getLoginFailure} from '@/auth/login-failure';
import {readTokenUserId} from '@/auth/read-app-token';
import {useRegisteredRejection} from '@/auth/registered-rejection';
import {useSession} from '@/auth/session-context';
import useGoogleConnect, {type GoogleConnectOutcome} from '@/auth/useGoogleConnect';
import {resetStackTo} from '@/shared/reset-stack';

export default function SignInScreen() {
  const {
    session: {token, isGuest, isSignedOutByServer},
    handlers: {signIn, startAsGuest},
  } = useSession();
  const {error} = useLocalSearchParams<{error?: string}>();
  const rejection = useRegisteredRejection();
  const {
    isPending: isConnectPending,
    handlers: {connect, discardGuestAndConnect},
  } = useGoogleConnect();

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const pendingActionCache = useRef<PendingAction | null>(null);
  const [failure, setFailure] = useState<LoginFailure | null>(error === 'failed' ? 'failed' : null);

  const handleSignIn = async () => {
    if (pendingActionCache.current !== null) {
      return;
    }

    pendingActionCache.current = 'google';
    setPendingAction('google');
    try {
      await signIn();
      setFailure(null);
    } catch (error) {
      captureException(error);
      setFailure('failed');
    } finally {
      pendingActionCache.current = null;
      setPendingAction(null);
    }
  };

  const handleStartAsGuest = async () => {
    if (pendingActionCache.current !== null) {
      return;
    }

    pendingActionCache.current = 'guest';
    setPendingAction('guest');
    try {
      await startAsGuest();
      setFailure(null);
      router.replace('/');
    } catch (error) {
      const nextFailure = getLoginFailure(error);
      if (nextFailure === 'failed') {
        captureException(error);
      }
      setFailure(nextFailure);
    } finally {
      pendingActionCache.current = null;
      setPendingAction(null);
    }
  };

  const handleConnectOutcome = (outcome: GoogleConnectOutcome) => {
    if (outcome === 'cancelled') {
      return;
    }

    setFailure(outcome === 'failed' ? 'failed' : null);
    if (outcome === 'connected') {
      resetStackTo('/');
    }
  };

  if (isGuest) {
    return (
      <GuestConnectSection
        failure={failure}
        handlers={{
          onConnect: () => {
            connect().then(handleConnectOutcome).catch(captureException);
          },
          onDiscard: async () => handleConnectOutcome(await discardGuestAndConnect()),
          onLeave: () => resetStackTo('/'),
        }}
        isPending={isConnectPending}
        isRejected={shouldShowRegisteredNotice(rejection, {userId: readTokenUserId(token), isGuest})}
      />
    );
  }

  return (
    <LoginSection
      failure={failure}
      handlers={{
        onSignIn: handleSignIn,
        onStartAsGuest: handleStartAsGuest,
        onExit: () => resetStackTo(INTRO_URL),
      }}
      isSignedOutByServer={isSignedOutByServer}
      pendingAction={pendingAction}
    />
  );
}
