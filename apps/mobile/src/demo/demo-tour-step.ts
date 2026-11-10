import {DEMO_TOUR_BUTTON_LABELS} from '@plan-for-myself/shared';

interface TourBubbleDisplayParams {
  stepIndex: number;
  stepCount: number;
  firstNumber: number;
  lastLabel: string;
}

export function getNextTourStepIndex(stepIndex: number, stepCount: number): number | null {
  const nextIndex = stepIndex + 1;

  return nextIndex < stepCount ? nextIndex : null;
}

export function getTourBubbleDisplay({stepIndex, stepCount, firstNumber, lastLabel}: TourBubbleDisplayParams): {
  number: number;
  primaryLabel: string;
} {
  return {
    number: stepIndex + firstNumber,
    primaryLabel: getNextTourStepIndex(stepIndex, stepCount) === null ? lastLabel : DEMO_TOUR_BUTTON_LABELS.next,
  };
}
