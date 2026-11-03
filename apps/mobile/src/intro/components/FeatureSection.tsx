import type {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import IntroFrame from '@/intro/components/IntroFrame';
import IntroSection from '@/intro/components/IntroSection';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface FeatureSectionProps extends PropsWithChildren {
  title: string;
  description: string | string[];
  onSubtleBand?: boolean;
}

export default function FeatureSection({title, description, onSubtleBand = false, children}: FeatureSectionProps) {
  return (
    <IntroSection onSubtleBand={onSubtleBand}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.description}>
          {[description].flat().map((phrase) => (
            <Text key={phrase} style={styles.phrase}>
              {phrase}
            </Text>
          ))}
        </View>
      </View>
      <IntroFrame onSubtleBand={onSubtleBand}>{children}</IntroFrame>
    </IntroSection>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.xs,
  },
  phrase: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});
