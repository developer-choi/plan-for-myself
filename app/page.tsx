'use client';

import React, {useCallback, useEffect} from 'react';
import {useDispatchOpenModal} from '@/store/reducers/modal';
import {GOAL_FULL_RESPONSE_QUERY_KEY, useGoalResponse} from '@/util/sevices/goal';
import GoalOverview from '@/component/GoalOverview';
import TotalGoalList from '@/component/TotalGoalList';
import {getRemainWeek} from '@/util/extend/date-util';
import {useQueryClient} from 'react-query';
import {postMultipleGoalApi} from '@/util/sevices/api/goal';
import styles from './page.module.scss';
import {getRemindOfMessageListApi} from '@/util/sevices/api/remind-of-message';
import {randomInArray} from '@/util/extend/random';
import {toast} from 'react-toastify';
import Button from '@/component/element/Button';

export default function Home() {
  const {openGoalModal, openCheckTodayModal} = useDispatchOpenModal();
  const {data} = useGoalResponse();
  const queryClient = useQueryClient();

  const loadGoalList = useCallback(async () => {
    const value = prompt('기존 goalList 값을 입력하세요.');

    if (value) {
      await postMultipleGoalApi(JSON.parse(value));
      queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
    }
  }, [queryClient]);

  useEffect(() => {
    (async () => {
      const list = await getRemindOfMessageListApi();
      const item = randomInArray(list);
      toast.info(item.message, {
        autoClose: 5000,
        position: 'top-center',
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: true,
      });
    })().then();
  }, []);

  if (!data) {
    return null;
  }

  const {todayHistory, originalGoalList} = data;

  return (
    <div className={styles.wrap}>
      <div className={styles.remainWeek}>올해 <em>{getRemainWeek(new Date())}</em>주 남음</div>

      {originalGoalList.length === 0 ? (
        <div className={styles.buttonWrap}>
          <Button onClick={() => openGoalModal()}>목표 추가하기</Button>
          <Button style={{marginLeft: 5}} onClick={loadGoalList}>불러오기</Button>
        </div>
      ) : (
        <>
          {todayHistory.has_checked ? (
            <GoalOverview todayHistory={todayHistory}/>
          ) : (
            <Button onClick={openCheckTodayModal}>
              {'오늘 목표 체크하러가기 >'}
            </Button>
          )}

          <TotalGoalList goalList={originalGoalList}/>
        </>
      )}
    </div>
  );
}
