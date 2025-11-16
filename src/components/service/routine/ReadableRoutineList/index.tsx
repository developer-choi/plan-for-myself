'use client';

import {ReadableRoutine} from '@/types/routine';
import {Button, ButtonLink} from '@forworkchoe/core/components';
import {DATE_TYPE_ITEMS, DateType} from '@/utils/service/constant/date-type';
import React, {ChangeEvent, useCallback, useMemo, useState} from 'react';
import styles from './index.module.scss';
import Radio, {RadioGroup} from '@/components/form/Radio';
import {getDefaultDateType} from '@/utils/extend/date/holiday';
import {useSortListWithDragAndDrop} from '@/utils/extend/useSortListWithDragAndDrop';
import {deleteRoutineApi, updateRoutineListOrderApi} from '@/utils/service/api/routine';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';
import {useHandleClientSideError} from '@/utils/service/error/client-side';

export interface ReadableRoutineListProps {
  record: Record<DateType, ReadableRoutine[]>;
}

export default function ReadableRoutineList({record}: ReadableRoutineListProps) {
  const [dateType, setDateType] = useState<DateType>(getDefaultDateType());
  // TODO 수정, 생성 성공 후 쿼리스트링 들어간거 보고 초기값 설정
  const list = useMemo(() => record[dateType], [dateType, record]);
  const handleClientSideError = useHandleClientSideError()

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setDateType(event.target.value as DateType);
  }, []);

  const onChangeRoutineList = useCallback(async (list: ReadableRoutine[]) => {
    // TODO 유효성검증 추가 필요. 아>점>저 순으로 되야함.
    await updateRoutineListOrderApi(list);
    await revalidateTagOnServerAction('READABLE_ROUTINE_LIST');
  }, []);

  const {onDropCallback, onDragStartCallback, onDragOver, draggable} = useSortListWithDragAndDrop({
    list,
    onChange: {
      all: onChangeRoutineList
    }
  });

  const deleteRoutine = useCallback(async (id: number) => {
    if (confirm('오늘 해당 루틴을 진행한 모든 기록이 같이 삭제됩니다. 삭제하시겠습니까?')) {
      try {
        await deleteRoutineApi(id);
        await revalidateTagOnServerAction('READABLE_ROUTINE_LIST');
      } catch (error) {
        handleClientSideError(error);
      }
    }
  }, [handleClientSideError]);

  return (
    <div className={styles.container}>
      <RadioGroup label="date_type">
        {DATE_TYPE_ITEMS.itemList.map(({name, value}) => (
          <Radio key={value} label={name} value={value} onChange={onChange} checked={value === dateType}/>
        ))}
      </RadioGroup>
      {list.map((routine, index) => (
        <div key={routine.id} className={styles.row} draggable={draggable} onDragOver={onDragOver} onDrop={onDropCallback(index)} onDragStart={onDragStartCallback(index)}>
          <span className={styles.title}>{routine.title}</span>
          <ButtonLink href={`/routine/${routine.id}/edit`} color="edit">수정</ButtonLink>
          <Button onClick={() => deleteRoutine(routine.id)} color="delete">삭제</Button>
        </div>
      ))}
    </div>
  );
}
