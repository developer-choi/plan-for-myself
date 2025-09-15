import {EffectCallback, useCallback, useEffect, useRef, useState} from 'react';

export function useToggle(initial = false) {
  const [bool, setBool] = useState(initial);

  const setTrue = useCallback(() => {
    setBool(true);
  }, []);

  const setFalse = useCallback(() => {
    setBool(false);
  }, []);

  const toggle = useCallback(() => {
    setBool(prevState => !prevState);
  }, []);

  return {
    bool,
    setTrue,
    setFalse,
    toggle
  };
}

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

export function useDelay(timeout: number) {
  const [bool, setBool] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBool(true);
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return bool;
}
