import {KeyboardShortcut} from '@forworkchoe/core/utils';

/*************************************************************************************************************
 * Background Settings
 *************************************************************************************************************/
const IMAGE_SHORTCUT: KeyboardShortcut = {
  key: 'B',
  specialKeys: ['ctrlKey', 'altKey']
};

const OPACITY_SHORTCUT: KeyboardShortcut = {
  key: 'O',
  specialKeys: ['ctrlKey', 'altKey']
};

export const BACKGROUND_SETTING_SHORTCUT = {
  image: IMAGE_SHORTCUT,
  opacity: OPACITY_SHORTCUT
};
