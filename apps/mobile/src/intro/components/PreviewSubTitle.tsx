import {StyleSheet} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface PreviewSubTitleProps {
  children: string;
}

export default function PreviewSubTitle({children}: PreviewSubTitleProps) {
  return <Text style={styles.subTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  subTitle: {
    ...typography.body3,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
});
