import {useRef, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import {useSession} from '@/auth/session-context';
import Text from '@/shared/components/Text';
import {spacing} from '@/shared/styles/design-tokens';

export default function SignInScreen() {
  const {
    handlers: {signIn},
  } = useSession();
  const [message, setMessage] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const isSigningInCache = useRef(false);

  const handleSignIn = async () => {
    if (isSigningInCache.current) {
      return;
    }

    isSigningInCache.current = true;
    setMessage('');
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (error) {
      setMessage(String(error));
    } finally {
      isSigningInCache.current = false;
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button disabled={isSigningIn} title="구글로 로그인" onPress={handleSignIn} />
      {message !== '' && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  message: {
    color: colors.text,
  },
});
