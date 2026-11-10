import type {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {colors, INTRO_TEXT} from '@plan-for-myself/shared';
import IntroSection from '@/intro/components/IntroSection';
import Text from '@/shared/components/Text';
import {typography} from '@/shared/styles/design-tokens';

interface OutroSectionProps {
  actions: ReactNode;
}

export default function OutroSection({actions}: OutroSectionProps) {
  return (
    <IntroSection onSubtleBand>
      <Text style={styles.heading}>{INTRO_TEXT.outroTitle}</Text>
      {actions}
    </IntroSection>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...typography.h3,
    fontWeight: 'bold',
    color: colors.text,
  },
});
