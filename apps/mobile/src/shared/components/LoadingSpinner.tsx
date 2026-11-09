import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import {fallbackSlotSizes} from '@/shared/components/fallback-slot';

export default function LoadingSpinner() {
  return (
    <View style={[styles.slot, fallbackSlotSizes.screen]}>
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
