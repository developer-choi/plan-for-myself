import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import Text from '@/shared/components/Text';
import {radius, spacing, typography} from '@/shared/styles/design-tokens';

interface LoginNoticeProps {
  title: string;
  /** 줄을 바꾸려면 줄바꿈 문자를 넣는다 */
  children: string;
}

export default function LoginNotice({title, children}: LoginNoticeProps) {
  return (
    <View style={styles.notice}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    padding: spacing.gridGap,
    backgroundColor: colors.failSoft,
    borderRadius: radius.sm,
  },
  title: {
    ...typography.body2,
    fontWeight: 'bold',
    color: colors.fail,
  },
  description: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});
