import {type ComponentType, createElement} from 'react';
import {openOnce} from '../overlay/open-once';
import type {DemoChoiceReason} from './demo-choice';

export interface DemoChoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reason: DemoChoiceReason;
}

interface OpenDemoChoiceDialogParams {
  reason: DemoChoiceReason;
  isLoggedIn: boolean;
  dialogs: {
    loggedIn: ComponentType<DemoChoiceDialogProps>;
    loggedOut: ComponentType<DemoChoiceDialogProps>;
  };
}

export function openDemoChoiceDialog({reason, isLoggedIn, dialogs}: OpenDemoChoiceDialogParams) {
  const ChoiceDialog = isLoggedIn ? dialogs.loggedIn : dialogs.loggedOut;

  openOnce('demo-choice', ({isOpen, unmount}) => createElement(ChoiceDialog, {isOpen, reason, onClose: unmount}));
}
