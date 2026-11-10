import {type PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import Text from '@/shared/components/Text';
import {radius, spacing, typography} from '@/shared/styles/design-tokens';

interface CardProps extends PropsWithChildren {
  title?: string;
}

export default function Card({title, children}: CardProps) {
  return (
    <View style={styles.card}>
      {title !== undefined && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
  },
  title: {
    ...typography.body2,
    marginBottom: spacing.sm,
    fontWeight: 'bold',
    color: colors.text,
  },
});
