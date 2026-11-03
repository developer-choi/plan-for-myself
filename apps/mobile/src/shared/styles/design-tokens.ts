export const fontFamily = 'NotoSansKR';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  pageXMobile: 12,
  gridGap: 12,
  formGap: 24,
} as const;

export const contentWidth = {
  narrow: 480,
  dialog: 328,
} as const;

export const controlHeight = {
  sm: 24,
  md: 36,
  lg: 42,
  xl: 48,
} as const;

export const touchTarget = {
  min: 44,
} as const;

export const opacity = {
  pressed: 0.8,
  disabled: 0.5,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 20,
} as const;

export const typography = {
  h2: {fontSize: 28, lineHeight: 40},
  h3: {fontSize: 20, lineHeight: 32},
  h4: {fontSize: 18, lineHeight: 24},
  body1: {fontSize: 16, lineHeight: 24},
  body2: {fontSize: 14, lineHeight: 20},
  body3: {fontSize: 12, lineHeight: 16},
} as const;

export const fontSize = {
  xxs: 10,
} as const;

export const shadows = {
  hover: '0 2px 8px rgba(0, 0, 0, 0.1)',
  dialog:
    '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
} as const;
