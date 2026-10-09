import Link from 'next/link';
import {Button} from '@developer-choi/design-system';
import IntroActions from '@/intro/components/IntroActions';
import TryWithoutLoginButton from '@/intro/components/TryWithoutLoginButton';

export default function LoggedOutIntroActions() {
  return (
    <IntroActions>
      <Button asChild size="large">
        <Link href="/login">구글 로그인으로 시작하기</Link>
      </Button>
      <TryWithoutLoginButton />
    </IntroActions>
  );
}
