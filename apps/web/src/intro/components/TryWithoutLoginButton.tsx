import {Button} from '@developer-choi/design-system';
import Link from 'next/link';
import {DEMO_HOME_URL} from '@/demo/demo-path';
import {DEMO_TOUR_LABEL} from '@/shared/labels';

export default function TryWithoutLoginButton() {
  return (
    <Button asChild color="secondary" size="large" variant="outlined">
      <Link href={DEMO_HOME_URL}>{DEMO_TOUR_LABEL}</Link>
    </Button>
  );
}
