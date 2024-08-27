'use client';

import React, {useCallback} from 'react';
import {numberWithComma} from '@/utils/extend/data-type/number';
import type {GoalFullResponse} from '@/types/goal';
import styles from './index.module.scss';
import Button from '@/components/design-system/element/Button';
import {useOpenModal} from '@/utils/extend/modal';
import CheckTodayModal from '@/components/modal/goal/CheckTodayModal';

export interface GoalOverviewProp {
  goalFullResponse: GoalFullResponse;
}

export default function GoalOverview({goalFullResponse}: GoalOverviewProp) {
  const {openModal} = useOpenModal();

  const onClick = useCallback(() => {
    openModal({
      Component: CheckTodayModal,
      props: {
        goalFullResponse
      }
    })
  }, [goalFullResponse, openModal]);

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
