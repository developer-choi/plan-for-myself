import {StyleSheet} from 'react-native';
import {spacing} from '@/shared/styles/design-tokens';

export const fallbackSlotSizes = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.pageXMobile,
  },
});
