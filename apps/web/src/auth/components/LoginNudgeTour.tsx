'use client';

import {Joyride, type Locale, type Options, type TooltipRenderProps} from 'react-joyride';
import LoginNudge from '@/auth/components/LoginNudge';

interface LoginNudgeTourProps {
  targetId: string;
}

export default function LoginNudgeTour({targetId}: LoginNudgeTourProps) {
  return (
    <Joyride
      run
      locale={LOGIN_NUDGE_LOCALE}
      options={LOGIN_NUDGE_OPTIONS}
      steps={[{target: `#${targetId}`, content: null, placement: 'bottom-end'}]}
      tooltipComponent={LoginNudgeTooltip}
    />
  );
}

const LOGIN_NUDGE_OPTIONS = {
  skipBeacon: true,
  hideOverlay: true,
  buttons: ['close'],
  arrowColor: 'var(--color-bg-inverse)',
} satisfies Partial<Options>;

const LOGIN_NUDGE_LOCALE = {close: '닫기'} satisfies Locale;

function LoginNudgeTooltip({closeProps}: TooltipRenderProps) {
  return <LoginNudge closeButtonProps={closeProps} />;
}
