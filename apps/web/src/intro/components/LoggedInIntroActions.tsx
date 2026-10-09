import Link from 'next/link';
import {Button} from '@developer-choi/design-system';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import IntroActions from '@/intro/components/IntroActions';

export default function LoggedInIntroActions() {
  return (
    <IntroActions>
      <Button asChild size="large">
        <Link href={DEFAULT_HOME_URL}>내 달력으로 이동</Link>
      </Button>
    </IntroActions>
  );
}
