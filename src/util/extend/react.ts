import {EffectCallback, useEffect, useRef} from 'react';

export function useIsFirstRender() {
  const ref = useRef(true);
  useEffect(() => {
    ref.current = false;
  }, []);
  return ref.current;
}

export function useEffectFromTheSecondTime(effect: EffectCallback) {
  const isFirstRendering = useIsFirstRender();

  useEffect(() => {
    if (isFirstRendering) {
      return;
    }

    effect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect]);
}
