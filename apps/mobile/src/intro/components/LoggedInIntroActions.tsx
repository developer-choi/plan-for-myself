import {MY_CALENDAR_LABEL} from '@plan-for-myself/shared/label';
import IntroActions from '@/intro/components/IntroActions';
import Button from '@/shared/components/Button';
import {resetStackTo} from '@/shared/reset-stack';

export default function LoggedInIntroActions() {
  return (
    <IntroActions>
      <Button label={MY_CALENDAR_LABEL} onPress={() => resetStackTo('/')} />
    </IntroActions>
  );
}
