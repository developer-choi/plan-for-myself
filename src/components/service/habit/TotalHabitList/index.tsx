'use client';

import React, {useCallback} from 'react';
import type {Habit, HabitFrequency} from '@/types/habit';
import {useDeleteHabit, useTotalHabitList} from '@/utils/service/habit';
import styles from './index.module.scss';
import designSystemStyles from '@/styles/design-system.module.scss';
import classNames from 'classnames';
import Button from '@/components/element/Button';
import HabitModal from '@/components/modal/habit/HabitModal';
import {useOpenModal} from '@/utils/extend/modal';

export interface TotalHabitListProp {
  habitList: Habit[];
  todayFrequency: HabitFrequency;
}

export default function TotalHabitList({habitList, todayFrequency}: TotalHabitListProp) {
  const {radioPropsList, filteredHabitList} = useTotalHabitList(habitList, todayFrequency);
  const deleteHabit = useDeleteHabit();
  const {openModal} = useOpenModal();

  const openHabitModal = useCallback((data?: Habit) => {
    openModal({
      Component: HabitModal,
      props: {
        data
      }
    })
  }, [openModal]);

  return (
    <>
      <h2 className={designSystemStyles.mainPageH2}>전체 습관 목록</h2>

      <fieldset style={{marginBottom: 10}} className={designSystemStyles.horizontalFieldset}>
        {radioPropsList.map(props => (
          <label key={props.value}>
            <input type="radio" {...props}/>
            {props.value}
          </label>
        ))}
      </fieldset>

      <ul>
        {filteredHabitList.map((habit) => (
          <ol key={habit.pk} className={styles.habitOl}>
            {!habit.has_important ? null : <div className={styles.importantMark}/>}
            <span className={styles.title}>{habit.title}</span>
            <Button size="xsmall" color="edit" className={classNames(styles.smallButton)} onClick={() => openHabitModal(habit)}>수정</Button>
            <Button size="xsmall" color="delete" className={classNames(styles.smallButton)} onClick={() => deleteHabit(habit)}>삭제</Button>
          </ol>
        ))}
      </ul>

      <div className={styles.buttonWrap}>
        <Button color="secondary" onClick={() => openHabitModal()}>새 습관 추가하기</Button>
      </div>
    </>
  );
}
