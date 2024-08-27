'use client';

import styles from '@/app/(service)/(private)/dashboard/page.module.scss';
import Button from '@/components/design-system/element/Button';
import React, {useCallback} from 'react';
import {postMultipleGoalApi} from '@/utils/service/api/goal';
import {useOpenModal} from '@/utils/extend/modal';
import GoalModal from '@/components/modal/goal/GoalModal';

export interface HomeMenuProps {

}

export default function HomeMenu({}: HomeMenuProps) {
  const {openModal} = useOpenModal();

  const openGoalModal = useCallback(() => {
    openModal({
      Component: GoalModal,
      props: {
        data: undefined
      }
    })
  }, [openModal]);

  const loadGoalList = useCallback(async () => {
    const value = prompt('기존 goalList 값을 입력하세요.');

    if (value) {
      await postMultipleGoalApi(JSON.parse(value));
      // queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
    }
  }, []);

  return (
    <div className={styles.buttonWrap}>
      <Button onClick={() => openGoalModal()}>목표 추가하기</Button>
      <Button style={{marginLeft: 5}} onClick={loadGoalList}>불러오기</Button>
    </div>
  )
}
