'use client';

import {useCallback, useEffect} from 'react';
import {useKeyboardShortcut} from '@/utils/extend/event/keyboard';
import {StorageObjectManager, useStorageObjectManager} from '@/utils/extend/browser/storage-object';
import {BACKGROUND_SETTING_SHORTCUT} from '@/utils/service/shortcuts';
import '@/styles/background-setting.scss';
import styles from '@/app/(service)/(private)/layout.module.scss';

export default function BackgroundImage() {
  const {state, changeState} = useStorageObjectManager(manager);

  useEffect(() => {
    if (!state.image) {
      return;
    }

    document.body.style.backgroundImage = `url('${state.image}')`;
    document.body.style.setProperty('--overlay-opacity', state.opacity.toString());
  }, [state]);

  const changeBackgroundImage = useCallback(() => {
    const image = window.prompt('background image url');

    if (image) {
      changeState({
        ...state,
        image: convert(image)
      });
    }
  }, [changeState, state]);

  const changeOpacity = useCallback(() => {
    const opacity = window.prompt('background opacity');

    if (opacity) {
      changeState({
        ...state,
        opacity: Number(opacity)
      });
    }
  }, [changeState, state]);

  useKeyboardShortcut(BACKGROUND_SETTING_SHORTCUT.image, changeBackgroundImage);
  useKeyboardShortcut(BACKGROUND_SETTING_SHORTCUT.opacity, changeOpacity);

  return (
    <div className={styles.right}>
      <button onClick={changeOpacity}>Opacity</button>
      <button onClick={changeBackgroundImage}>Image</button>
    </div>
  );
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

function convert(url: string) {
  const match = url.match(/https:\/\/drive\.google\.com\/file\/d\/([^\/]+)/);

  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  } else {
    return url;
  }
}
