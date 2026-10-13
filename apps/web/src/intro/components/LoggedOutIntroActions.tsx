import Link from 'next/link';
import {Button} from '@developer-choi/design-system';
import IntroActions from '@/intro/components/IntroActions';
import TryWithoutLoginButton from '@/intro/components/TryWithoutLoginButton';
import {START_RECORDING_LABEL} from '@/shared/labels';

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
