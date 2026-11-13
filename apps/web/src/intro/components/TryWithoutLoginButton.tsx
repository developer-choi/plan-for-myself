import {DEMO_HOME_URL} from '@plan-for-myself/shared/demo';
import {DEMO_TOUR_LABEL} from '@plan-for-myself/shared/label';
import {Button} from '@developer-choi/design-system';
import Link from 'next/link';

export default function TryWithoutLoginButton() {
  return (
    <Button asChild color="secondary" size="large" variant="outlined">
      <Link href={DEMO_HOME_URL}>{DEMO_TOUR_LABEL}</Link>
    </Button>
  );
}
