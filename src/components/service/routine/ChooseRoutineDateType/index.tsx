'use client';

import {ProcessableRoutine} from '@/types/routine';
import React, {useCallback, useState} from 'react';
import {DATE_TYPE_ITEMS, DateType} from '@/utils/service/constant/date-type';
import Button, {ButtonLink} from '@/components/element/Button';
import {useRouter} from 'next/navigation';
import styles from './index.module.scss';
import ProcessableRoutinePage from '@/components/service/routine/ProcessableRoutineStepList';

export interface ChooseRoutineDateTypeProps {
  record: Record<DateType, ProcessableRoutine[]>;
}

export default function ChooseRoutineDateType({record}: ChooseRoutineDateTypeProps) {
  const {push} = useRouter();
  const [dateType, setDateType] = useState<DateType>();

  const goCreatePage = useCallback(() => {
    push('/routine/create');
  }, [push]);

  const startRoutine = setDateType;

  if (!dateType) {
    return (
      <>
        <ButtonLink style={{marginBottom: 16}} href="/routine/list" size="large" className="full">루틴 관리</ButtonLink>
        <div className={styles.container}>
          {DATE_TYPE_ITEMS.typeList.map(dateType => {
            const hasRoutine = record[dateType].length !== 0;
            const onClick = hasRoutine ? () => startRoutine(dateType) : goCreatePage;
            const buttonText = `${hasRoutine ? 'Start' : 'Create'} ${dateType} routine`;

            return (
              <Button key={dateType} onClick={onClick} color="secondary" size="small">{buttonText}</Button>
            );
          })}
        </div>
      </>
    );

  } else {
    return (
      <ProcessableRoutinePage routine={record[dateType][0]}/>
    );
  }
}
