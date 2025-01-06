'use client';

import {ReadableRoutine} from '@/types/routine';
import {ButtonLink} from '@/components/element/Button';
import {DATE_TYPE_ITEMS, DateType} from '@/utils/service/constant/date-type';
import {ChangeEvent, useCallback, useMemo, useState} from 'react';
import styles from './index.module.scss';
import Radio, {RadioGroup} from '@/components/form/Radio';
import {getDefaultDateType} from '@/utils/extend/date/holiday';
import {useSortListWithDragAndDrop} from '@/utils/extend/useSortListWithDragAndDrop';
import {updateRoutineListOrderApi} from '@/utils/service/api/routine';

export interface ReadableRoutineListProps {
  record: Record<DateType, ReadableRoutine[]>;
}

export default function ReadableRoutineList({record}: ReadableRoutineListProps) {
  const [dateType, setDateType] = useState<DateType>(getDefaultDateType());
  // TODO 수정, 생성 성공 후 쿼리스트링 들어간거 보고 초기값 설정
  const list = useMemo(() => record[dateType], [dateType, record]);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setDateType(event.target.value as DateType);
  }, []);

  const onChangeRoutineList = useCallback(async (list: ReadableRoutine[]) => {
    // TODO 유효성검증 추가 필요. 아>점>저 순으로 되야함.
    await updateRoutineListOrderApi(list);
  }, []);

  const {onDropCallback, onDragStartCallback, onDragOver, draggable} = useSortListWithDragAndDrop({
    list,
    onChange: {
      all: onChangeRoutineList
    }
  });

  // TODO 삭제 기능을 넣되, 주의사항으로 해당 루틴의 모든 스텝과, 오늘 그 스탭을 진행한 기록이 모두 삭제된다고 묻기
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
          <ButtonLink href={`/routine/${routine.id}/edit`} color="delete">삭제</ButtonLink>
        </div>
      ))}
    </div>
  );
}
