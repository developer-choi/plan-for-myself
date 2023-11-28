import styled from 'styled-components';
import React from 'react';
import {useDispatchOpenModal} from '@store/reducers/modal';
import Button from '@component/common/button';
import {useGoalResponse} from '@util/sevices/goal';
import GoalOverview from '@component/GoalOverview';
import ContinuousGoalList from '@component/ContinuousGoalList';
import TotalGoalList from '@component/TotalGoalList';

export default function Home() {
  const {openGoalModal, openCheckTodayModal} = useDispatchOpenModal()
  const {data} = useGoalResponse()

  if (!data) {
    return null
  }
  
  const {hasCheckedToday, checkedGoalHistoryList, continuousGoalHistory, goalList, accumulateGoalRate} = data

  return (
    <Wrap>
      {goalList.length === 0 ? (
        <Button onClick={() => openGoalModal()}>목표 추가하기</Button>
      ) : (
        <>
          {hasCheckedToday ? (
            <GoalOverview accumulateGoalRate={accumulateGoalRate} todayHistory={checkedGoalHistoryList[0]}/>
          ) : (
            <Button onClick={openCheckTodayModal}>
              {'오늘 목표 체크하러가기 >'}
            </Button>
          )}

          {!continuousGoalHistory ? null : (
            <ContinuousGoalList continuousGoalList={continuousGoalHistory.continuousGoalList}/>
          )}

          <TotalGoalList goalList={goalList}/>
        </>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 20px;
`;
