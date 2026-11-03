import GoogleAccount from '@/auth/components/GoogleAccount';
import GuestAccount from '@/auth/components/GuestAccount';
import {useSession} from '@/auth/session-context';

export default function AccountSection() {
  const {
    session: {isGuest},
  } = useSession();

  return isGuest ? <GuestAccount /> : <GoogleAccount />;
}
