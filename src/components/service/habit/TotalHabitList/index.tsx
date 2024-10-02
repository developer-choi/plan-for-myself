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
import Radio, {RadioGroup} from '@/components/form/Radio';
import Checkbox from '@/components/form/Checkbox';

export interface TotalHabitListProp {
  habitList: Habit[];
  todayFrequency: HabitFrequency;
}

export default function TotalHabitList({habitList, todayFrequency}: TotalHabitListProp) {
  const {radioPropsList, filteredHabitList, hiddenArchieved} = useTotalHabitList(habitList, todayFrequency);
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

      <form style={{marginBottom: 24}} className={designSystemStyles.commonSubForm}>
        <RadioGroup>
          {radioPropsList.map(props => (
            <Radio key={props.value} {...props}/>
          ))}
        </RadioGroup>

        <Checkbox {...hiddenArchieved}/>
      </form>

      <ul>
        {filteredHabitList.map((habit) => (
          <ol key={habit.pk} className={styles.habitOl}>
            {!habit.has_unachieved ? null : <div className={styles.importantMark}/>}
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
