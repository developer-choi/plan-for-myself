import {HorizontalFieldset, MainPageH2} from '@component/common/etc';
import React from 'react';
import type {Goal} from '@type/goal';
import {useDeleteGoal, useTotalGoalList} from '@util/sevices/goal';
import styled from 'styled-components';
import Button, {BaseButton} from '@component/common/button';
import {numberWithComma} from '@util/extend/number';
import {useDispatchOpenModal} from '@store/reducers/modal';

export interface TotalGoalListProp {
  goalList: Goal[]
}

export default function TotalGoalList({goalList}: TotalGoalListProp) {
  const {radioPropsList, filteredGoalList} = useTotalGoalList(goalList)
  const {openGoalModal} = useDispatchOpenModal()
  const deleteGoal = useDeleteGoal()

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
            {goal.title}
            <GoalPrice className="plus">+{numberWithComma(goal.achievePrice)}원</GoalPrice>
            {!goal.notAchievePrice ? null : <GoalPrice className="minus">-{numberWithComma(goal.notAchievePrice)}원</GoalPrice>}
            <SmallButton className="edit" onClick={() => openGoalModal({data: goal})}>수정</SmallButton>
            <SmallButton className="delete" onClick={() => deleteGoal(goal)}>삭제</SmallButton>
          </GoalOl>
        ))}
      </ul>

      <Button style={{marginTop: 10}} className="light-main" onClick={() => openGoalModal()}>새 목표 추가하기</Button>
    </>
  )
}


const GoalPrice = styled.span`
  margin-inline: 2px;
  &.plus {
    color: blue;
  }
  
  &.minus {
    color: red;
  }
`;

const GoalOl = styled.ol`
  display: flex;
  align-items: center;
  
  &:not(:first-child) {
    margin-top: 5px;
  }
`;

const SmallButton = styled(BaseButton)`
  padding: 2px 8px;
  margin-left: 4px;
  
  color: white;
  font-size: 12px;
  
  &.edit {
    background: orange;
  }
  
  &.delete {
    background: red;
  }
`;
