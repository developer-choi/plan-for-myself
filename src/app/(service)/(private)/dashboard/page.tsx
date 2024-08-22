import React from 'react';
import GoalOverview from '@/components/goal/GoalOverview';
import TotalGoalList from '@/components/goal/TotalGoalList';
import {getRemainWeek} from '@/utils/extend/date/util';
import styles from './page.module.scss';
import HomeMenu from '@/components/home/HomeMenu';
import {getGoalListApi} from '@/utils/service/api/goal';
import {GoalFullResponse} from '@/types/goal';

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
