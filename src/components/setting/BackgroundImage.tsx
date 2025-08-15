'use client';

import {useCallback, useEffect} from 'react';
import {useKeyboardShortcut} from '@/utils/extend/event/keyboard';
import {StorageObjectManager, useStorageObjectManager} from '@/utils/extend/browser/storage-object';
import {BACKGROUND_SETTING_SHORTCUT} from '@/utils/service/shortcuts';
import '@/styles/background-setting.scss';

export default function BackgroundImage() {
  const {state, changeState} = useStorageObjectManager(manager)
  
  useEffect(() => {
    if (!state.image) {
      return;
    }

    document.body.style.backgroundImage = `url('${state.image}')`;
    document.body.style.setProperty('--overlay-opacity', state.opacity.toString());
  }, [state]);

  useKeyboardShortcut(BACKGROUND_SETTING_SHORTCUT.image, useCallback(() => {
    const image = window.prompt('background image url');

    if (image) {
      changeState({
        ...state,
        image
      });
    }
  }, [changeState, state]));
  
  useKeyboardShortcut(BACKGROUND_SETTING_SHORTCUT.opacity, useCallback(() => {
    const opacity = window.prompt('background opacity');

    if (opacity) {
      changeState({
        ...state,
        opacity: Number(opacity)
      });
    }
  }, [changeState, state]));

  return null;
}

interface BackgroundSetting {
  image: string;
  opacity: number;
}

const manager = new StorageObjectManager<BackgroundSetting>({
  key: 'background-setting',
  storage: 'LOCAL_STORAGE',
  defaultValue: {
    image: '',
    opacity: 0.9
  }
});
