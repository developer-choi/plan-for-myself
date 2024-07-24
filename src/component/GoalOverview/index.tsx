import React from 'react';
import {useDispatchOpenModal} from '@/store/reducers/modal';
import {numberWithComma} from '@/util/extend/number';
import type {GoalFullResponse} from '@/type/goal-server';
import styles from './index.module.scss';

export interface GoalOverviewProp {
  todayHistory: GoalFullResponse['todayHistory'];
}

export default function GoalOverview({todayHistory}: GoalOverviewProp) {
  const {openCheckTodayModal} = useDispatchOpenModal()

  return (
    <div>
      <span className={styles.resultText}>
        오늘 정산금액 : <span className={styles.price}>{numberWithComma(todayHistory.total_price)}원</span>
        <a style={{marginLeft: 8}} className={styles.styledLink} onClick={openCheckTodayModal}>
          {'내역 보기 >'}
        </a>
      </span>
    </div>
  );
}
