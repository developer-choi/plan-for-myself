import type {FloatingOptions, Locale, Options, Styles} from 'react-joyride';

export const DEMO_TOUR_STEP_COUNT = 5;

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

export const DEMO_TOUR_LOCALE = {next: '다음', last: '마치기', close: '닫기'} satisfies Locale;

/* 달력 투어의 마지막 말풍선(2/5)은 통계 화면으로 이어지므로 투어 전체의 끝이 아니다 */
export const DEMO_CALENDAR_TOUR_LOCALE = {...DEMO_TOUR_LOCALE, last: '다음'} satisfies Locale;
