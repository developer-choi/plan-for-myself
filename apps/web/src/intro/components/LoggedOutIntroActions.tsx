import Link from 'next/link';
import {Button} from '@developer-choi/design-system';
import {START_RECORDING_LABEL} from '@plan-for-myself/shared';
import IntroActions from '@/intro/components/IntroActions';
import TryWithoutLoginButton from '@/intro/components/TryWithoutLoginButton';

export default function LoggedOutIntroActions() {
  return (
    <IntroActions>
      <Button asChild size="large">
        <Link href="/login">{START_RECORDING_LABEL}</Link>
      </Button>
      <TryWithoutLoginButton />
    </IntroActions>
  );
}
