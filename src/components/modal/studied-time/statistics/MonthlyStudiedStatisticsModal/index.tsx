'use client';

import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import DefaultModalBody from '@/components/modal/body';
import React from 'react';
import DailyStudiedTimeTable from '@/components/service/studied-time/statistics/DailyStudiedTimeTable';
import MonthlyStatisticsSummary, {
  MonthlyStatisticsSummaryProps
} from '@/components/service/studied-time/statistics/MonthlyStatisticsSummary';
import {H2} from '@/components/element/typography';
import {padToTwoDigits} from '@/utils/extend/data-type/string';
import {DefaultModalHeader} from '@/components/modal/header';
import styles from './index.module.scss';

export interface MonthlyStudiedStatisticsModalProps extends ComposedModalProps {
  year: number;
  month: number;
  monthData: MonthlyStatisticsSummaryProps['monthData'];
}

export default function MonthlyStudiedStatisticsModal({year, month, monthData, ...rest}: MonthlyStudiedStatisticsModalProps) {
  return (
    <ModalContainer type="fullScreen" easilyClose {...rest}>
      <DefaultModalHeader onClose={rest.onClose}>{year}-{padToTwoDigits(month)} 월별 통계</DefaultModalHeader>
      <DefaultModalBody>
        <H2 className={styles.subHeading}>공부시간 직전월 비교</H2>
        <MonthlyStatisticsSummary monthData={monthData} />

        <H2 className={styles.subHeading}>일일 기록</H2>
        <DailyStudiedTimeTable year={year} month={month} data={monthData.this} />
      </DefaultModalBody>
    </ModalContainer>
  );
}
