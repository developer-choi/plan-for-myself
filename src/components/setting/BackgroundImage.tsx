'use client';

import {useCallback, useEffect} from 'react';
import {useKeyboardShortcut} from '@/utils/extend/event/keyboard';
import {useStorageObjectManager} from '@/utils/extend/browser/storage-object';
import {BACKGROUND_SETTING_SHORTCUT} from '@/utils/service/shortcuts';
import '@/styles/background-setting.scss';
import styles from '@/app/(service)/(private)/layout.module.scss';
import {backgroundImageManager, googleDriveShareImageToPublicUrl} from '@/utils/service/background-image';

export default function BackgroundImage() {
  const {state, changeState} = useStorageObjectManager(backgroundImageManager);

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
        image: googleDriveShareImageToPublicUrl(image)
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
