'use client';

import styles from '@/app/(service)/(private)/dashboard/page.module.scss';
import Button from '@/components/element/Button';
import React, {useCallback} from 'react';
import {useOpenModal} from '@/utils/extend/modal';
import HabitModal from '@/components/modal/habit/HabitModal';

export interface HomeMenuProps {

}

export default function HomeMenu({}: HomeMenuProps) {
  const {openModal} = useOpenModal();

  const openHabitModal = useCallback(() => {
    openModal({
      Component: HabitModal,
      props: {
        data: undefined
      }
    })
  }, [openModal]);

  return (
    <div className={styles.buttonWrap}>
      <Button onClick={() => openHabitModal()}>습관 추가하기</Button>
    </div>
  )
}
