'use client';

import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import DefaultModalBody from '@/components/modal/body';
import React from 'react';
import DailyStudiedTimeTable from '@/components/service/studied-time/statistics/DailyStudiedTimeTable';
import MonthlyStatisticsTable from '@/components/service/studied-time/statistics/MonthlyStatisticsTable';
import {useQuery} from '@tanstack/react-query';
import {getStudiedTimeApi} from '@/utils/service/api/studied-time';
import {H2} from '@/components/element/typography';
import {padToTwoDigits} from '@/utils/extend/data-type/string';
import {DefaultModalHeader} from '@/components/modal/header';
import styles from './index.module.scss';

export interface MonthlyStudiedStatisticsModalProps extends ComposedModalProps {
  year: number;
  month: number;
}

export default function MonthlyStudiedStatisticsModal({year, month, ...rest}: MonthlyStudiedStatisticsModalProps) {
  const {data} = useQuery({
    queryKey: ['daily-studied-time'],
    queryFn: () => getStudiedTimeApi(year, month),
    refetchOnWindowFocus: false
  });

  if (!data) {
    return null;
  }

  return (
    <ModalContainer type="fullScreen" easilyClose {...rest}>
      <DefaultModalHeader onClose={rest.onClose}>{year}-{padToTwoDigits(month)} 월별 통계</DefaultModalHeader>
      <DefaultModalBody>
        <H2 className={styles.subHeading}>직전 월 비교 요약</H2>
        <MonthlyStatisticsTable year={year} month={month} data={data} />

        <H2 className={styles.subHeading}>일일 기록</H2>
        <DailyStudiedTimeTable year={year} month={month} data={data} />
      </DefaultModalBody>
    </ModalContainer>
  );
}
