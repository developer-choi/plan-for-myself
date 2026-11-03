import {Alert} from 'react-native';
import {LOGOUT_LABEL} from '@plan-for-myself/shared';
import {useSession} from '@/auth/session-context';
import HeaderMenu from '@/shared/components/HeaderMenu';

export default function CalendarMenu() {
  const {
    handlers: {signOut},
  } = useSession();

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert(LOGOUT_FAILED_TITLE, String(error));
    }
  };

  return <HeaderMenu items={[{label: LOGOUT_LABEL, onPress: () => void logout()}]} />;
}

const LOGOUT_FAILED_TITLE = '로그아웃하지 못했어요';
