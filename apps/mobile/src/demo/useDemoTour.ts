import {type RefObject, useEffect, useEffectEvent, useState} from 'react';
import type {View} from 'react-native';
import {padTourRect, TOUR_SPOTLIGHT_PADDING, type TourBubblePlacement, type TourRect} from '@/demo/demo-tour-geometry';
import {getNextTourStepIndex} from '@/demo/demo-tour-step';
import {measureTourTarget} from '@/demo/measure-tour-target';

export interface DemoTourStep {
  content: string;
  targetRef: RefObject<View | null>;
  spotlightPadding?: number;
  placement?: TourBubblePlacement;
  beforeMeasure?: () => void;
}

interface UseDemoTourParams {
  isOpen: boolean;
  steps: DemoTourStep[];
  handlers: {
    onClose: () => void;
    onFinish: () => void;
  };
}

interface UseDemoTourResult {
  stepIndex: number;
  hole: TourRect | null;
  handlers: {
    onNext: () => void;
  };
}

export default function useDemoTour({isOpen, steps, handlers}: UseDemoTourParams): UseDemoTourResult {
  const {onClose, onFinish} = handlers;
  const [stepIndex, setStepIndex] = useState(0);
  const [hole, setHole] = useState<TourRect | null>(null);
  const nextStepIndex = getNextTourStepIndex(stepIndex, steps.length);

  const goToNextStep = () => {
    if (nextStepIndex === null) {
      onClose();
      return;
    }

    setHole(null);
    setStepIndex(nextStepIndex);
  };

  const prepareStep = useEffectEvent(() => {
    const step = steps[stepIndex];

    step.beforeMeasure?.();

    return step.targetRef;
  });

  const applyMeasuredRect = useEffectEvent((rect: TourRect | null) => {
    if (rect === null) {
      goToNextStep();
    } else {
      setHole(padTourRect(rect, steps[stepIndex].spotlightPadding ?? TOUR_SPOTLIGHT_PADDING));
    }
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    return measureTourTarget(prepareStep(), applyMeasuredRect);
  }, [isOpen, stepIndex]);

  const onNext = () => {
    goToNextStep();

    if (nextStepIndex === null) {
      onFinish();
    }
  };

  return {stepIndex, hole, handlers: {onNext}};
}
