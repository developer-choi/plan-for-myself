import React from 'react';
import GoalOverview from '@/component/goal/GoalOverview';
import TotalGoalList from '@/component/goal/TotalGoalList';
import {getRemainWeek} from '@/util/extend/date-util';
import styles from './page.module.scss';
import HomeMenu from '@/component/home/HomeMenu';
import {getGoalListApi} from '@/util/sevices/api/goal-server';
import {GoalFullResponse} from '@/type/goal';

export default async function Home() {
  const goalFullResponse = (await getGoalListApi()).json as GoalFullResponse;
  const {originalGoalList, todayFrequency} = goalFullResponse;

  return (
    <div className={styles.wrap}>
      <div className={styles.remainWeek}>올해 <em>{getRemainWeek(new Date())}</em>주 남음</div>

      {originalGoalList.length === 0 ? (
        <HomeMenu/>
      ) : (
        <>
          <GoalOverview goalFullResponse={goalFullResponse}/>
          <TotalGoalList goalList={originalGoalList} todayFrequency={todayFrequency}/>
        </>
      )}
    </div>
  );
}
