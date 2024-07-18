import {HorizontalFieldset, MainPageH2} from '@component/common/etc';
import React, {useCallback} from 'react';
import type {Goal} from '@type/goal';
import {useDeleteGoal, useGoalResponse, useTotalGoalList} from '@util/sevices/goal';
import styled from 'styled-components';
import Button, {BaseButton} from '@component/common/button';
import {useDispatchOpenModal} from '@store/reducers/modal';

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
      <MainPageH2>전체 목표 목록</MainPageH2>

      <HorizontalFieldset style={{marginBottom: 10}}>
        {radioPropsList.map(props => (
          <label key={props.value}>
            <input type="radio" {...props}/>
            {props.value}
          </label>
        ))}
      </HorizontalFieldset>

      <ul>
        {filteredGoalList.map((goal) => (
          <GoalOl key={goal.pk}>
            {!goal.is_important ? null : <ImportantMark/>}
            {frequency !== 'All' ? null : <Frequency>({goal.frequency.toLowerCase()})</Frequency>}
            <Title>{goal.title}</Title>
            <SmallButton className="edit" onClick={() => openGoalModal({data: goal})}>수정</SmallButton>
            <SmallButton className="delete" onClick={() => deleteGoal(goal)}>삭제</SmallButton>
          </GoalOl>
        ))}
      </ul>

      <Button style={{marginTop: 10}} className="light-main" onClick={() => openGoalModal()}>새 목표 추가하기</Button>
      {!data ? null : (
        <Button style={{marginLeft: 5}} className="light-main" onClick={copyGoalList}>복사하기</Button>
      )}
    </>
  );
}

const GoalOl = styled.ol`
  display: flex;
  align-items: center;
  
  &:not(:first-child) {
    margin-top: 16px;
  }
`;

const SmallButton = styled(BaseButton)`
  padding: 2px 8px;
  margin-left: 4px;
  
  &:first-of-type {
    margin-left: auto;
  }
  
  color: white;
  font-size: 12px;
  
  &.edit {
    background: orange;
  }
  
  &.delete {
    background: red;
  }
`;

const ImportantMark = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: red;
  margin-right: 3px;
`;

const Frequency = styled.span`
  font-size: 12px;
  color: #7a7a7a;
  margin-right: 6px;
`;

const Title = styled.span`
  color: black;
`;
