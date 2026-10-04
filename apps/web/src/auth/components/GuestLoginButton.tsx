'use client';

import {useCallback, useState} from 'react';
import {signIn} from 'next-auth/react';
import {Button} from '@developer-choi/design-system';
import {getRedirectUrlWhenLoginSuccess} from '@/auth/redirect';

export default function GuestLoginButton() {
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(() => {
    setLoading(true);
    signIn('guest', {callbackUrl: getRedirectUrlWhenLoginSuccess()});
  }, []);

  return (
    <Button color="secondary" loading={loading} size="xLarge" variant="outlined" onClick={onClick}>
      로그인 없이 이용하기
    </Button>
  );
}
