'use client';

import {useCallback, useState} from 'react';
import {signIn} from 'next-auth/react';
import {Button} from '@developer-choi/design-system';
import {DEFAULT_HOME_URL} from '@/auth/redirect';

export default function TryWithoutLoginButton() {
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(() => {
    setLoading(true);
    signIn('guest', {callbackUrl: DEFAULT_HOME_URL});
  }, []);

  return (
    <Button color="secondary" loading={loading} size="large" variant="outlined" onClick={onClick}>
      로그인 없이 체험하기
    </Button>
  );
}
