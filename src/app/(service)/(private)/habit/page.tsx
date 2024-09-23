import React from 'react';
import HabitOverview from '@/components/service/habit/HabitOverview';
import TotalHabitList from '@/components/service/habit/TotalHabitList';
import {getRemainWeek} from '@/utils/extend/date/util';
import styles from './page.module.scss';
import HomeMenu from '@/components/service/home/HomeMenu';
import {getHabitListApi} from '@/utils/service/api/habit';
import {HabitFullResponse} from '@/types/habit';

export default async function Home() {
  const habitFullResponse = (await getHabitListApi()).json as HabitFullResponse;
  const {originalHabitList, todayFrequency} = habitFullResponse;

  return (
    <div className={styles.wrap}>
      <div className={styles.remainWeek}>올해 <em>{getRemainWeek(new Date())}</em>주 남음</div>

      {originalHabitList.length === 0 ? (
        <HomeMenu/>
      ) : (
        <>
          <HabitOverview habitFullResponse={habitFullResponse}/>
          <TotalHabitList habitList={originalHabitList} todayFrequency={todayFrequency}/>
        </>
      )}
    </div>
  );
}
