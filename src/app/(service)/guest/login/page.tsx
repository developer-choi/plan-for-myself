'use client';

import Button from '@/component/design-system/element/Button';
import {useCallback, useEffect} from 'react';
import {signIn} from 'next-auth/react';
import {getRedirectUrlWhenLoginSuccess} from '@/utils/service/auth/redirect';

export default function Page() {
  const onClick = useCallback(() => {
    signIn('google', {
      callbackUrl: getRedirectUrlWhenLoginSuccess()
    });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');

    if (error) {
      alert(error === 'AccessDenied' ? '존재하지 않는 아이디입니다.' : '로그인이 실패했습니다.');
    }
  }, []);

  return (
    <Button onClick={onClick}>Sign in Google</Button>
  );
}
