'use client';

import React, {useCallback} from 'react';
import {useDispatchOpenModal} from '@/store/reducers/modal';
import {numberWithComma} from '@/util/extend/number';
import type {GoalFullResponse} from '@/type/goal';
import styles from './index.module.scss';
import Button from '../design-system/element/Button';

export interface GoalOverviewProp {
  goalFullResponse: GoalFullResponse;
}

export default function GoalOverview({goalFullResponse}: GoalOverviewProp) {
  const {openCheckTodayModal} = useDispatchOpenModal();

  const onClick = useCallback(() => {
    openCheckTodayModal({goalFullResponse})
  }, [goalFullResponse, openCheckTodayModal]);

  if (!goalFullResponse.todayHistory.has_checked) {
    return (
      <Button onClick={onClick}>
        {'오늘 목표 체크하러가기 >'}
      </Button>
    );
  } else {
    return (
      <div>
        <span className={styles.resultText}>
          오늘 정산금액 : <span className={styles.price}>{numberWithComma(goalFullResponse.todayHistory.total_price)}원</span>
          <a style={{marginLeft: 8}} className={styles.styledLink} onClick={onClick}>
            {'내역 보기 >'}
          </a>
        </span>
      </div>
    );
  }
}
