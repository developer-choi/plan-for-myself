import {
  type DemoChoiceDialogProps,
  LOGGED_OUT_DEMO_CHOICE_MESSAGES,
  START_RECORDING_LABEL,
} from '@plan-for-myself/shared';
import DemoChoiceDialogFrame from '@/demo/components/DemoChoiceDialogFrame';
import {resetStackTo} from '@/shared/reset-stack';

export default function LoggedOutDemoChoiceDialog({isOpen, onClose, reason}: DemoChoiceDialogProps) {
  const {title, description} = LOGGED_OUT_DEMO_CHOICE_MESSAGES[reason];

  const goToSignIn = () => {
    onClose();
    resetStackTo('/sign-in');
  };

  return (
    <DemoChoiceDialogFrame
      content={{title, description, actionLabel: START_RECORDING_LABEL}}
      handlers={{onAction: goToSignIn, onClose}}
      isOpen={isOpen}
    />
  );
}
