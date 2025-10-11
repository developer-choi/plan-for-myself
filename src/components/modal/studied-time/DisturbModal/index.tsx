import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import {DifferenceMonthlyStatisticsParam} from '@/utils/service/studied-time/statistics';
import {DefaultModalHeader} from '@/components/modal/header';
import {padToTwoDigits} from '@forworkchoe/core/utils';
import DefaultModalBody from '@/components/modal/body';
import MonthlyStatisticsSummary from '@/components/service/studied-time/statistics/MonthlyStatisticsSummary';
import React from 'react';
import {useStorageObjectManager} from '@forworkchoe/core/hooks';
import {backgroundImageManager} from '@/utils/service/background-image';
import styles from './index.module.scss';
import {useDelay} from '@/utils/extend/library/react';

export interface DisturbModalProps extends ComposedModalProps {
  year: number;
  month: number;
  monthData: DifferenceMonthlyStatisticsParam['monthData'];
}

export default function DisturbModal({year, month, monthData, onClose, ...rest}: DisturbModalProps) {
  const {state} = useStorageObjectManager(backgroundImageManager);
  const active = useDelay(5000);
  const _onClose = active ? onClose : () => {}

  return (
    <ModalContainer type="fullScreen" onClose={_onClose} {...rest}>
      <DefaultModalHeader onClose={_onClose}>{year}-{padToTwoDigits(month)} 월별 통계</DefaultModalHeader>
      <DefaultModalBody>
        <MonthlyStatisticsSummary year={year} month={month} monthData={monthData} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.image} src={state.image} alt="배경이미지"/>
      </DefaultModalBody>
    </ModalContainer>
  )
}
