import type {ContinuousGoal} from '@type/goal';
import React from 'react';
import {MainPageH2} from '@component/common/etc';
import styled from 'styled-components';

export interface ContinuousGoalListProp {
  continuousGoalList: ContinuousGoal[]
}

export default function ContinuousGoalList({continuousGoalList}: ContinuousGoalListProp) {
  return (
    <>
      <MainPageH2>연속 달성중인 목표</MainPageH2>
      <ul>
        {continuousGoalList.map(({pk, title, continuousDate}) => (
          <StyledContinuousGoal key={pk}>
            <span className="date">{continuousDate}</span>
            <span className="title">{title}</span>
          </StyledContinuousGoal>
        ))}
      </ul>
    </>
  )
}

const StyledContinuousGoal = styled.ol`
  display: flex;
  align-items: center;
  
  span.date {
    color: ${props => props.theme.main};
    font-weight: bold;
    margin-right: 10px;
    font-size: 18px;
  }
`;
