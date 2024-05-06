import styled from 'styled-components';
import React, {useCallback} from 'react';
import {useDispatchOpenModal} from '@store/reducers/modal';
import Button from '@component/common/button';
import {GOAL_FULL_RESPONSE_QUERY_KEY, useGoalResponse} from '@util/sevices/goal';
import GoalOverview from '@component/GoalOverview';
import TotalGoalList from '@component/TotalGoalList';
import {initializeGoalList} from '@util/server/goal';
import {useQueryClient} from 'react-query';
import {getRemainWeek} from '@util/extend/date-util';

export default function Home() {
  const {openGoalModal, openCheckTodayModal} = useDispatchOpenModal();
  const {data} = useGoalResponse();

  const queryClient = useQueryClient();

  const loadGoalList = useCallback(() => {
    const value = prompt('기존 goalList 값을 입력하세요.');

    if (value) {
      initializeGoalList(value);
      queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
    }
  }, [queryClient]);

  if (!data) {
    return null;
  }

  const {todayHistory, originalGoalList} = data;

  return (
    <Wrap>
      <RemainWeek>올해 <em>{getRemainWeek(new Date())}</em>주 남음</RemainWeek>

      {originalGoalList.length === 0 ? (
        <>
          <Button onClick={() => openGoalModal()}>목표 추가하기</Button>
          <Button style={{marginLeft: 5}} className="light-main" onClick={loadGoalList}>불러오기</Button>
        </>
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

const RemainWeek = styled.div`
  em {
    font-weight: bold;
    color: ${props => props.theme.main};
    font-size: 20px;
  }
  
  margin-bottom: 8px;
`;
