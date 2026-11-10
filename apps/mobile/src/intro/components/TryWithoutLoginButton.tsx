import {router} from 'expo-router';
import {DEMO_HOME_URL, DEMO_TOUR_LABEL} from '@plan-for-myself/shared';
import Button from '@/shared/components/Button';

export default function TryWithoutLoginButton() {
  return (
    <Button color="secondary" label={DEMO_TOUR_LABEL} variant="outlined" onPress={() => router.push(DEMO_HOME_URL)} />
  );
}
