'use client';

import React, {useCallback} from 'react';
import type {HabitFullResponse} from '@/types/habit';
import styles from './index.module.scss';
import Button from '@/components/element/Button';
import {useOpenModal} from '@/utils/extend/modal';
import CheckTodayModal from '@/components/modal/habit/CheckTodayModal';

export interface HabitOverviewProp {
  habitFullResponse: HabitFullResponse;
}

export default function HabitOverview({habitFullResponse}: HabitOverviewProp) {
  const {openModal} = useOpenModal();

  const onClick = useCallback(() => {
    openModal({
      Component: CheckTodayModal,
      props: {
        habitFullResponse
      }
    })
  }, [habitFullResponse, openModal]);

  if (!habitFullResponse.todayHistory.has_checked) {
    return (
      <Button onClick={onClick}>
        {'오늘 습관 체크하러가기 >'}
      </Button>
    );
  } else {
    return (
      <div>
        <span className={styles.resultText}>
          <a style={{marginLeft: 8}} className={styles.styledLink} onClick={onClick}>
            {'내역 보기 >'}
          </a>
        </span>
      </div>
    );
  }
}
