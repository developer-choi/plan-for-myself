import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import {fallbackSlotSizes} from '@/shared/components/fallback-slot';
import {type FallbackSize} from '@/shared/types/fallback';

interface LoadingSpinnerProps {
  size?: FallbackSize;
}

export default function LoadingSpinner({size = 'screen'}: LoadingSpinnerProps) {
  return (
    <View style={[styles.slot, fallbackSlotSizes[size]]}>
      <ActivityIndicator color={colors.primary} size={SPINNER_SIZE} />
    </View>
  );
}

const SPINNER_SIZE = 32;

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
