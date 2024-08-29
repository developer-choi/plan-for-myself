'use client';

import styles from './index.module.scss';
import Radio, {RadioGroup} from '@/components/form/Radio';
import {ChangeEvent, useCallback} from 'react';
import {StudiedTimeCellMode} from '@/types/studied-time';
import {useRouter, useSearchParams} from 'next/navigation';

export default function StudiedTimeSetting() {
  const {replace} = useRouter();
  
  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    replace('?cellMode=' + event.target.value);
  }, [replace]);

  const searchParams = useSearchParams();
  // TODO 이 쿼리스트링 키값 어떻게 페이지마다 동일하게 통일하려고했지?
  const currentMode = searchParams.get('cellMode') as StudiedTimeCellMode ?? 'default';

  return (
    <div className={styles.wrap}>
      <RadioGroup label="보기 설정">
        {STUDIED_TIME_CELL_MODES.map((mode) => (
          <Radio key={mode} label={mode} name="mode" value={mode} checked={currentMode === mode} onChange={onChange}/>
        ))}
      </RadioGroup>
    </div>
  );
}

const STUDIED_TIME_CELL_MODES: StudiedTimeCellMode[] = ['default', 'sleep_time'];
