'use client';

import React, {useCallback} from 'react';
import type {Goal, GoalFrequency} from '@/types/goal';
import {useDeleteGoal, useTotalGoalList} from '@/utils/service/goal';
import {useDispatchOpenModal} from '@/store/reducers/modal';
import styles from './index.module.scss';
import commonStyles from '@/styles/common.module.scss';
import classNames from 'classnames';
import Button from '@/components/design-system/element/Button';

export interface TotalGoalListProp {
  goalList: Goal[];
  todayFrequency: GoalFrequency;
}

export default function TotalGoalList({goalList, todayFrequency}: TotalGoalListProp) {
  const {radioPropsList, filteredGoalList, currentFrequency} = useTotalGoalList(goalList, todayFrequency);
  const {openGoalModal} = useDispatchOpenModal();
  const deleteGoal = useDeleteGoal();

  const copyGoalList = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(goalList));
    alert('복사되었습니다.');
  }, [goalList]);

  return (
    <>
      <h2 className={commonStyles.mainPageH2}>전체 목표 목록</h2>

      <fieldset style={{marginBottom: 10}} className={commonStyles.horizontalFieldset}>
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
            <Button size="xsmall" color="edit" className={classNames(styles.smallButton)} onClick={() => openGoalModal({data: goal})}>수정</Button>
            <Button size="xsmall" color="delete" className={classNames(styles.smallButton)} onClick={() => deleteGoal(goal)}>삭제</Button>
          </ol>
        ))}
      </ul>

      <div className={styles.buttonWrap}>
        <Button color="secondary" onClick={() => openGoalModal()}>새 목표 추가하기</Button>
        <Button color="secondary" variant="outlined" onClick={copyGoalList}>복사하기</Button>
      </div>
    </>
  );
}
