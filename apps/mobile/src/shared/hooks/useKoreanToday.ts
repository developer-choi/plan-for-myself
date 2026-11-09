import {useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {getKoreanToday} from '@plan-for-myself/shared/date';

export default function useKoreanToday(): string {
  const [today, setToday] = useState(() => getKoreanToday());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (appState) => {
      if (appState === 'active') {
        setToday(getKoreanToday());
      }
    });

    return () => subscription.remove();
  }, []);

  return today;
}
