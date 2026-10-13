import Link from 'next/link';
import {Button} from '@developer-choi/design-system';
import {DEFAULT_HOME_URL} from '@/auth/redirect';
import IntroActions from '@/intro/components/IntroActions';
import {MY_CALENDAR_LABEL} from '@/shared/labels';

export default function LoggedInIntroActions() {
  return (
    <IntroActions>
      <Button asChild size="large">
        <Link href={DEFAULT_HOME_URL}>{MY_CALENDAR_LABEL}</Link>
      </Button>
    </IntroActions>
  );
}
