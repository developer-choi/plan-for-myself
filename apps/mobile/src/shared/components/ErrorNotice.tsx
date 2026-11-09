import {Pressable, StyleSheet, View} from 'react-native';
import {type Href, Link} from 'expo-router';
import {colors} from '@plan-for-myself/shared';
import Button from '@/shared/components/Button';
import Logo from '@/shared/components/Logo';
import Text from '@/shared/components/Text';
import {contentWidth, opacity, spacing, typography} from '@/shared/styles/design-tokens';

interface ErrorNoticeAction {
  label: string;
  onPress: () => void | Promise<void>;
}

interface ErrorNoticeLink {
  href: Href;
  label: string;
}

interface ErrorNoticeProps {
  title: string;
  content: string;
  action: ErrorNoticeAction;
  link?: ErrorNoticeLink;
  size?: 'large' | 'medium';
}

export default function ErrorNotice({title, content, action, link, size = 'large'}: ErrorNoticeProps) {
  const isFullScreen = size === 'large';
  const textStyles = isFullScreen ? largeTextStyles : mediumTextStyles;

  const notice = (
    <View style={styles.frame}>
      <View style={styles.container}>
        <Logo size="large" />
        <View style={styles.text}>
          <Text style={[styles.title, textStyles.title]}>{title}</Text>
          <Text style={[styles.content, textStyles.content]}>{content}</Text>
        </View>
        <Button label={action.label} style={styles.action} onPress={action.onPress} />
      </View>
      {link && (
        <Link asChild replace href={link.href}>
          {/* Link asChild가 Pressable의 함수 style을 버려서, children 함수로 눌림 상태를 받아 Text에 건다 */}
          <Pressable hitSlop={spacing.sm}>
            {({pressed}) => <Text style={[styles.link, pressed && styles.pressed]}>{link.label}</Text>}
          </Pressable>
        </Link>
      )}
    </View>
  );

  return isFullScreen ? <View style={styles.main}>{notice}</View> : notice;
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.page,
  },
  frame: {
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: contentWidth.narrow,
  },
  container: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  text: {
    gap: spacing.md,
    maxWidth: contentWidth.narrow,
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.xs,
  },
  link: {
    ...typography.body2,
    padding: spacing.xs,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: opacity.pressed,
  },
});

const largeTextStyles = StyleSheet.create({
  title: typography.h2,
  content: typography.body1,
});

const mediumTextStyles = StyleSheet.create({
  title: typography.h4,
  content: typography.body2,
});
