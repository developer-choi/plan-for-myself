import TourBubble from '@/demo/components/TourBubble';
import TourOverlay from '@/demo/components/TourOverlay';
import {getTourBubbleDisplay} from '@/demo/demo-tour-step';
import useDemoTour, {type DemoTourStep} from '@/demo/useDemoTour';

interface DemoTourProps {
  isOpen: boolean;
  steps: DemoTourStep[];
  firstNumber: number;
  lastLabel: string;
  handlers: {
    onClose: () => void;
    onFinish: () => void;
  };
}

export default function DemoTour({isOpen, steps, firstNumber, lastLabel, handlers}: DemoTourProps) {
  const {onClose} = handlers;
  const {
    stepIndex,
    hole,
    handlers: {onNext},
  } = useDemoTour({isOpen, steps, handlers});
  const step = steps[stepIndex];
  const {number, primaryLabel} = getTourBubbleDisplay({stepIndex, stepCount: steps.length, firstNumber, lastLabel});

  return (
    <TourOverlay
      bubble={
        <TourBubble
          content={step.content}
          handlers={{onPrimary: onNext, onClose}}
          number={number}
          primaryLabel={primaryLabel}
        />
      }
      handlers={{onRequestClose: onClose}}
      hole={hole}
      isOpen={isOpen}
      placement={step.placement ?? 'auto'}
    />
  );
}
