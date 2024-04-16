import React from 'react';
import styled from 'styled-components';
import {useDispatchOpenModal} from '@store/reducers/modal';
import {numberWithComma} from '@util/extend/number';
import type {CheckedGoalHistory} from '@type/goal';

export interface GoalOverviewProp {
  todayHistory: CheckedGoalHistory
}

export default function GoalOverview({todayHistory}: GoalOverviewProp) {
  const {openCheckTodayModal} = useDispatchOpenModal()

  return (
    <div>
      <ResultText>
        금일 정산금액 : <Price>{numberWithComma(todayHistory.totalPrice)}원</Price>
        <StyledLink style={{marginLeft: 8}} onClick={openCheckTodayModal}>
          {'내역 보기 >'}
        </StyledLink>
      </ResultText>
    </div>
  );
}

const StyledLink = styled.a`
  color: ${props => props.theme.main};
  font-weight: bold;
  font-size: 14px;
`;

const ResultText = styled.span`
  display: block;
  font-size: 16px;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.main};
`;
