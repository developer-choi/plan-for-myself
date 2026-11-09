import {type DemoChoiceDialogProps, LOGGED_IN_DEMO_CHOICE_TITLES} from '@plan-for-myself/shared/demo';
import {MY_CALENDAR_LABEL} from '@plan-for-myself/shared/label';
import DemoChoiceDialogFrame from '@/demo/components/DemoChoiceDialogFrame';
import {resetStackTo} from '@/shared/reset-stack';

export default function LoggedInDemoChoiceDialog({isOpen, onClose, reason}: DemoChoiceDialogProps) {
  const goToMyCalendar = () => {
    onClose();
    resetStackTo('/');
  };

  return (
    <DemoChoiceDialogFrame
      content={{title: LOGGED_IN_DEMO_CHOICE_TITLES[reason], actionLabel: MY_CALENDAR_LABEL}}
      handlers={{onAction: goToMyCalendar, onClose}}
      isOpen={isOpen}
    />
  );
}
