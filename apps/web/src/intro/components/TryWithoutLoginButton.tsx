import {Button} from '@developer-choi/design-system';
import Link from 'next/link';
import {DEMO_HOME_URL} from '@/demo/demo-path';

export default function TryWithoutLoginButton() {
  return (
    <Button asChild color="secondary" size="large" variant="outlined">
      <Link href={DEMO_HOME_URL}>예시 둘러보기</Link>
    </Button>
  );
}
