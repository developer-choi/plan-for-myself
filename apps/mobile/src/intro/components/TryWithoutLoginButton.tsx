import {router} from 'expo-router';
import {DEMO_HOME_URL} from '@plan-for-myself/shared/demo';
import {DEMO_TOUR_LABEL} from '@plan-for-myself/shared/label';
import Button from '@/shared/components/Button';

export default function TryWithoutLoginButton() {
  return (
    <Button color="secondary" label={DEMO_TOUR_LABEL} variant="outlined" onPress={() => router.push(DEMO_HOME_URL)} />
  );
}
