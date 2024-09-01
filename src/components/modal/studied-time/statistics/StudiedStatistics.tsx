'use client';

import {useOpenModal} from '@/utils/extend/modal';
import Button from '@/components/element/Button';
import {useCallback} from 'react';
import MonthlyStudiedStatisticsModal from '@/components/modal/studied-time/statistics/MonthlyStudiedStatisticsModal';

export interface StudiedStatisticsProps {
  year: number;
  month: number;
}

export default function StudiedStatistics({year, month}: StudiedStatisticsProps) {
  const {openModal} = useOpenModal();

  const openMonthlyStatistics = useCallback(() => {
    openModal({
      Component: MonthlyStudiedStatisticsModal,
      props: {
        year,
        month,
      }
    });
  }, [month, openModal, year]);

  return (
    <div>
      <Button onClick={openMonthlyStatistics}>Monthly Statistics</Button>
    </div>
  )
}
