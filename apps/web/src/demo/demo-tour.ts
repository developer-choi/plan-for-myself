import type {FloatingOptions, Locale, Options, Styles} from 'react-joyride';

export const DEMO_TOUR_STEP_COUNT_WITH_CHOICE_DIALOG = 5;

export const DEMO_TOUR_OPTIONS = {
  skipBeacon: true,
  closeButtonAction: 'skip',
  blockTargetInteraction: true,
  overlayClickAction: false,
  dismissKeyAction: false,
  skipScroll: true,
} satisfies Partial<Options>;

export const DEMO_TOUR_FLOATING_OPTIONS = {hideArrow: true} satisfies Partial<FloatingOptions>;

export const DEMO_TOUR_STYLES = {floater: {filter: 'none'}} satisfies Partial<Styles>;

export const DEMO_TOUR_LOCALE = {next: '다음', last: '다음', close: '닫기'} satisfies Locale;
