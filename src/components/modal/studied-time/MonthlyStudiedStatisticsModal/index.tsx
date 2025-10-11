'use client';

import {ComposedModalProps, DefaultModalBody, DefaultModalHeader, ModalContainer} from '@forworkchoe/core/components';
import React from 'react';
import DailyStudiedTimeTable from '@/components/service/studied-time/statistics/DailyStudiedTimeTable';
import MonthlyStatisticsSummary from '@/components/service/studied-time/statistics/MonthlyStatisticsSummary';
import {H2} from '@/components/element/typography';
import {padToTwoDigits} from '@forworkchoe/core/utils';
import styles from './index.module.scss';
import {DifferenceMonthlyStatisticsParam} from '@/utils/service/studied-time/statistics';

export interface MonthlyStudiedStatisticsModalProps extends ComposedModalProps {
  year: number;
  month: number;
  monthData: DifferenceMonthlyStatisticsParam['monthData'];
}

export default function MonthlyStudiedStatisticsModal({year, month, monthData, ...rest}: MonthlyStudiedStatisticsModalProps) {
  return (
    <ModalContainer type="fullScreen" easilyClose {...rest}>
      <DefaultModalHeader onClose={rest.onClose}>{year}-{padToTwoDigits(month)} 월별 통계</DefaultModalHeader>
      <DefaultModalBody>
        <H2 className={styles.subHeading}>공부시간 직전월 비교</H2>
        <MonthlyStatisticsSummary year={year} month={month} monthData={monthData} />

        <H2 className={styles.subHeading}>일일 기록</H2>
        <DailyStudiedTimeTable year={year} month={month} data={monthData.this} />
      </DefaultModalBody>
    </ModalContainer>
  );
}
