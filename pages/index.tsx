import styled from 'styled-components';
import React from 'react';
import {useDispatchOpenModal} from '@store/reducers/modal';
import Button from '@component/common/button';
import {useGoalResponse} from '@util/sevices/goal';
import GoalOverview from '@component/GoalOverview';
import TotalGoalList from '@component/TotalGoalList';

export default function Home() {
  const {openGoalModal, openCheckTodayModal} = useDispatchOpenModal()
  const {data} = useGoalResponse()

  if (!data) {
    return null
  }

  const {todayHistory, originalGoalList} = data;

  return (
    <Wrap>
      {originalGoalList.length === 0 ? (
        <Button onClick={() => openGoalModal()}>목표 추가하기</Button>
      ) : (
        <>
          {todayHistory.hasChecked ? (
            <GoalOverview todayHistory={todayHistory}/>
          ) : (
            <Button onClick={openCheckTodayModal}>
              {'오늘 목표 체크하러가기 >'}
            </Button>
          )}

          <TotalGoalList goalList={originalGoalList}/>
        </>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 20px;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
`;
