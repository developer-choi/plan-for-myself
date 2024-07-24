import React, {useCallback} from 'react';
import type {Goal} from '@/type/goal';
import {useDeleteGoal, useGoalResponse, useTotalGoalList} from '@/util/sevices/goal';
import Button, {BaseButton} from '@/component/common/button';
import {useDispatchOpenModal} from '@/store/reducers/modal';
import styles from './index.module.scss';
import commonStyles from '@/util/style/common.module.scss';
import classNames from 'classnames';

export interface TotalGoalListProp {
  goalList: Goal[];
}

export default function TotalGoalList({goalList}: TotalGoalListProp) {
  const {radioPropsList, filteredGoalList, frequency} = useTotalGoalList(goalList);
  const {openGoalModal} = useDispatchOpenModal();
  const deleteGoal = useDeleteGoal();

  const {data} = useGoalResponse();

  const copyGoalList = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(data?.originalGoalList));
    alert('복사되었습니다.');
  }, [data?.originalGoalList]);

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
            {frequency !== 'All' ? null : <span className={styles.frequency}>({goal.frequency.toLowerCase()})</span>}
            <span className={styles.title}>{goal.title}</span>
            <BaseButton className={classNames(styles.smallButton, styles.edit)} onClick={() => openGoalModal({data: goal})}>수정</BaseButton>
            <BaseButton className={classNames(styles.smallButton, styles.delete)} onClick={() => deleteGoal(goal)}>삭제</BaseButton>
          </ol>
        ))}
      </ul>

      <Button style={{marginTop: 10}} className="light-main" onClick={() => openGoalModal()}>새 목표 추가하기</Button>
      {!data ? null : (
        <Button style={{marginLeft: 5}} className="light-main" onClick={copyGoalList}>복사하기</Button>
      )}
    </>
  );
}
