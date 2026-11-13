import type {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {INTRO_TEXT} from '@plan-for-myself/shared/intro';
import IntroFrame from '@/intro/components/IntroFrame';
import IntroSection from '@/intro/components/IntroSection';
import Logo from '@/shared/components/Logo';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface HeroSectionProps {
  actions: ReactNode;
  preview: ReactNode;
}

export default function HeroSection({actions, preview}: HeroSectionProps) {
  return (
    <IntroSection style={styles.hero}>
      <View style={styles.brand}>
        <Logo size="medium" />
        <Text style={styles.brandName}>Plan for myself</Text>
      </View>
      <Text style={styles.heading}>{INTRO_TEXT.heroTitle}</Text>
      <IntroFrame>{preview}</IntroFrame>
      {actions}
    </IntroSection>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  brand: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  brandName: {
    ...typography.body2,
    fontWeight: 'bold',
    color: colors.text,
  },
  heading: {
    ...typography.h2,
    fontWeight: 'bold',
    color: colors.text,
  },
});
