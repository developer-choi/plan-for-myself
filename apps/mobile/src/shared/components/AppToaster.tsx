import {StyleSheet, useWindowDimensions} from 'react-native';
import {Easing, Keyframe} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Toaster} from 'sonner-native';
import {colors} from '@plan-for-myself/shared/color';
import {fontFamily, radius, shadows, spacing, typography} from '@/shared/styles/design-tokens';

export default function AppToaster() {
  const insets = useSafeAreaInsets();
  const {width: windowWidth} = useWindowDimensions();
  const toastWidth = Math.min(windowWidth - spacing.lg * 2, TOAST_MAX_WIDTH);

  return (
    <Toaster
      pauseWhenPageIsHidden
      animation={TOAST_ANIMATION}
      duration={TOAST_DURATION}
      enableStacking={false}
      gap={spacing.md}
      icons={TOAST_ICONS}
      offset={insets.bottom + spacing.lg}
      position="bottom-center"
      swipeToDismissDirection={SWIPE_DOWN_TO_DISMISS_AT_BOTTOM}
      toastOptions={{unstyled: true, style: {...styles.toast, width: toastWidth}, titleStyle: styles.message}}
      visibleToasts={MAX_VISIBLE_TOASTS}
    />
  );
}

const TOAST_MAX_WIDTH = 356;
const TOAST_DURATION = 1800;
const ANIMATION_DURATION = 150;
const MAX_VISIBLE_TOASTS = 2;
const SWIPE_DOWN_TO_DISMISS_AT_BOTTOM = 'up';

const TOAST_ANIMATION = {
  enter: new Keyframe({
    0: {opacity: 0, transform: [{translateY: 60}]},
    100: {opacity: 1, transform: [{translateY: 0}], easing: Easing.out(Easing.ease)},
  }).duration(ANIMATION_DURATION),
  exit: new Keyframe({
    0: {opacity: 1},
    100: {opacity: 0, easing: Easing.in(Easing.ease)},
  }).duration(ANIMATION_DURATION),
};

const TOAST_ICONS = {info: null};

const styles = StyleSheet.create({
  toast: {
    alignSelf: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    boxShadow: shadows.hover,
  },
  message: {
    ...typography.body2,
    fontFamily,
    color: colors.onPrimary,
    fontWeight: '500',
  },
});
