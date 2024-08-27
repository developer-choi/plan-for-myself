'use client';

import React, {useCallback} from 'react';
import type {Goal, GoalFrequency} from '@/types/goal';
import {useDeleteGoal, useTotalGoalList} from '@/utils/service/goal';
import styles from './index.module.scss';
import designSystemStyles from '@/styles/design-system.module.scss';
import classNames from 'classnames';
import Button from '@/components/design-system/element/Button';
import GoalModal from '@/components/modal/goal/GoalModal';
import {useOpenModal} from '@/utils/extend/modal';

export interface TotalGoalListProp {
  goalList: Goal[];
  todayFrequency: GoalFrequency;
}

export default function TotalGoalList({goalList, todayFrequency}: TotalGoalListProp) {
  const {radioPropsList, filteredGoalList, currentFrequency} = useTotalGoalList(goalList, todayFrequency);
  const deleteGoal = useDeleteGoal();
  const {openModal} = useOpenModal();

  const openGoalModal = useCallback((data?: Goal) => {
    openModal({
      Component: GoalModal,
      props: {
        data
      }
    })
  }, [openModal]);

  return (
    <>
      <h2 className={designSystemStyles.mainPageH2}>전체 목표 목록</h2>

      <fieldset style={{marginBottom: 10}} className={designSystemStyles.horizontalFieldset}>
        {radioPropsList.map(props => (
          <label key={props.value}>
            <input type="radio" {...props}/>
            {props.value}
          </label>
        ))}
      </fieldset>

      <ul>
        {filteredGoalList.map((goal) => (
          <ol key={goal.pk} className={styles.goalOl}>
            {!goal.is_important ? null : <div className={styles.importantMark}/>}
            {currentFrequency !== 'All' ? null : <span className={styles.frequency}>({goal.frequency.toLowerCase()})</span>}
            <span className={styles.title}>{goal.title}</span>
            <Button size="xsmall" color="edit" className={classNames(styles.smallButton)} onClick={() => openGoalModal(goal)}>수정</Button>
            <Button size="xsmall" color="delete" className={classNames(styles.smallButton)} onClick={() => deleteGoal(goal)}>삭제</Button>
          </ol>
        ))}
      </ul>

      <div className={styles.buttonWrap}>
        <Button color="secondary" onClick={() => openGoalModal()}>새 목표 추가하기</Button>
      </div>
    </>
  );
}
