import type {CSSProperties} from 'react';
import {colors} from '@plan-for-myself/shared';

type ThemeVariable = `--color-${string}` | '--shadow-focus';

export const themeStyle: CSSProperties = {
  '--color-bg-accent': colors.accent,
  '--color-fg-accent': colors.accent,
  '--color-fg-info': colors.accent,
  '--color-bg-info-soft': colors.accentSoft,
  '--color-fg-destructive': colors.fail,
  '--color-bg-destructive': colors.fail,
  '--color-bg-danger-soft': colors.failSoft,
  '--color-bg-danger-light': colors.failLight,
  '--color-fg-success': colors.success,
  '--color-bg-success-soft': colors.successSoft,
  '--color-fg-primary': colors.text,
  '--color-fg-secondary': colors.textSecondary,
  '--color-fg-muted': colors.textMuted,
  '--color-fg-subtle': colors.line,
  '--color-bg-primary': colors.card,
  '--color-bg-secondary': colors.page,
  '--color-bg-neutral-soft': colors.off,
  '--color-bg-tertiary': colors.off,
  '--color-bg-logo': colors.logo,
  '--shadow-focus': `0 0 0 3px color-mix(in srgb, ${colors.accent} 25%, transparent)`,
} satisfies Record<ThemeVariable, string>;
