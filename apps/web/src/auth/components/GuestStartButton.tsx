'use client';

import {useState} from 'react';
import {captureException} from '@sentry/nextjs';
import {signIn} from 'next-auth/react';
import {Button} from '@developer-choi/design-system';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import {useHandleClientSideError} from '@/shared/error/useHandleClientSideError';

export default function GuestStartButton() {
  const [loading, setLoading] = useState(false);

  const handleClientSideError = useHandleClientSideError();

  const startAsGuest = async () => {
    setLoading(true);
    try {
      await signIn('guest', {callbackUrl: DEFAULT_HOME_URL});
    } catch (error) {
      captureException(error);
      handleClientSideError(error);
      setLoading(false);
    }
  };

  return (
    <Button color="secondary" loading={loading} size="xLarge" variant="outlined" onClick={startAsGuest}>
      게스트로 시작하기
    </Button>
  );
}
