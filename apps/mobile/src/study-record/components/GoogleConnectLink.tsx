import {Pressable, StyleSheet} from 'react-native';
import {Link} from 'expo-router';
import {colors, GOOGLE_CONNECT_PAGE_LABEL} from '@plan-for-myself/shared';
import Text from '@/shared/components/Text';
import {opacity, typography} from '@/shared/styles/design-tokens';

export default function GoogleConnectLink() {
  return (
    <Link asChild href="/sign-in">
      {/* Link asChild가 Pressable의 함수 style을 버려서, children 함수로 눌림 상태를 받아 Text에 건다 */}
      <Pressable>
        {({pressed}) => <Text style={[styles.label, pressed && styles.pressed]}>{GOOGLE_CONNECT_PAGE_LABEL}</Text>}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.body2,
    fontWeight: 'bold',
    textAlign: 'right',
    color: colors.primary,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
