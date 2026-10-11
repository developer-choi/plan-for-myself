import {Button} from '@developer-choi/design-system';
import Link from 'next/link';
import {DEMO_HOME_URL} from '@/demo/demo-path';

export default function TryWithoutLoginButton() {
  return (
    <Button asChild color="secondary" size="large" variant="outlined">
      <Link href={DEMO_HOME_URL}>로그인 없이 체험하기</Link>
    </Button>
  );
}
