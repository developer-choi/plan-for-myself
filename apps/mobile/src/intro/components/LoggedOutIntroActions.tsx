import {router} from 'expo-router';
import {START_RECORDING_LABEL} from '@plan-for-myself/shared';
import IntroActions from '@/intro/components/IntroActions';
import TryWithoutLoginButton from '@/intro/components/TryWithoutLoginButton';
import Button from '@/shared/components/Button';

export default function LoggedOutIntroActions() {
  return (
    <IntroActions>
      <Button label={START_RECORDING_LABEL} onPress={() => router.replace('/sign-in')} />
      <TryWithoutLoginButton />
    </IntroActions>
  );
}
