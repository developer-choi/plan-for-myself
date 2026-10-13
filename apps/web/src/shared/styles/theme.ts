import type {CSSProperties} from 'react';
import {colors} from '@plan-for-myself/shared';

type ThemeVariable = `--color-${string}` | '--shadow-focus' | `--content-width-${string}`;

export const themeStyle: CSSProperties = {
  '--color-primary': colors.primary,
  '--color-fg-info': colors.primary,
  '--color-bg-info-soft': colors.primarySoft,
  '--color-fg-destructive': colors.fail,
  '--color-bg-destructive': colors.fail,
  '--color-bg-danger-soft': colors.failSoft,
  '--color-bg-danger-light': colors.failLight,
  '--color-fg-success': colors.success,
  '--color-bg-success-soft': colors.successSoft,
  '--color-fg-default': colors.text,
  '--color-fg-secondary': colors.textSecondary,
  '--color-fg-muted': colors.textMuted,
  '--color-fg-subtle': colors.line,
  '--color-bg-default': colors.card,
  '--color-bg-subtle': colors.page,
  '--color-bg-neutral-soft': colors.off,
  '--color-bg-muted': colors.off,
  '--shadow-focus': `0 0 0 3px color-mix(in srgb, ${colors.primary} 25%, transparent)`,
  '--content-width-narrow': '480px',
  '--content-width-reading': '600px',
} satisfies Record<ThemeVariable, string>;
