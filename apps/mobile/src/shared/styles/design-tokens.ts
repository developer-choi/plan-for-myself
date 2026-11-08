export const fontFamily = 'NotoSansKR';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pageXMobile: 12,
  gridGap: 12,
} as const;

export const contentWidth = {
  narrow: 480,
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
  full: 20,
} as const;

export const typography = {
  h2: {fontSize: 28, lineHeight: 40},
  h3: {fontSize: 20, lineHeight: 32},
  body1: {fontSize: 16, lineHeight: 24},
  body2: {fontSize: 14, lineHeight: 20},
  body3: {fontSize: 12, lineHeight: 16},
} as const;

export const shadows = {
  hover: '0 2px 8px rgba(0, 0, 0, 0.1)',
} as const;
