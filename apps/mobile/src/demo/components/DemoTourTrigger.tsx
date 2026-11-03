import {useEffect, useEffectEvent} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {captureException} from '@sentry/react-native';
import {overlay} from 'overlay-kit';
import DemoCalendarTour, {type DemoCalendarTourTargets} from '@/demo/components/DemoCalendarTour';
import DemoStatsTour, {type DemoStatsTourTargets} from '@/demo/components/DemoStatsTour';
import {hasSeenDemoTour, markDemoTourSeen} from '@/demo/demo-tour-seen';

type DemoTourTriggerProps = ({part: 'calendar'} & DemoCalendarTourTargets) | ({part: 'stats'} & DemoStatsTourTargets);

export default function DemoTourTrigger(props: DemoTourTriggerProps) {
  const {part} = props;

  const openTour = useEffectEvent(() => {
    overlay.open(({isOpen, unmount}) => (
      <ErrorBoundary fallback={null} onError={(error) => captureException(error)}>
        {props.part === 'calendar' ? (
          <DemoCalendarTour handlers={{onClose: unmount}} isOpen={isOpen} month={props.month} targets={props.targets} />
        ) : (
          <DemoStatsTour handlers={{onClose: unmount}} isOpen={isOpen} targets={props.targets} />
        )}
      </ErrorBoundary>
    ));
  });

  useEffect(() => {
    if (hasSeenDemoTour(part)) {
      return;
    }

    markDemoTourSeen(part);
    openTour();
  }, [part]);

  return null;
}
