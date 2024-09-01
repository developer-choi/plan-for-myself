'use client';

import {useOpenModal} from '@/utils/extend/modal';
import Button from '@/components/element/Button';
import {useCallback} from 'react';
import MonthlyStudiedStatisticsModal from '@/components/modal/studied-time/statistics/MonthlyStudiedStatisticsModal';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getMonthlyStatisticsApi} from '@/utils/service/api/studied-time';

export interface StudiedStatisticsProps {
  year: number;
  month: number;
}

export default function StudiedStatistics({year, month}: StudiedStatisticsProps) {
  const {openModal} = useOpenModal();

  const {isLoading} = useQuery({
    queryKey: ['daily-studied-time'],
    enabled: false
  });

  const queryClient = useQueryClient();

  const openMonthlyStatistics = useCallback(async () => {
    const monthData = await queryClient.fetchQuery({
      queryKey: ['daily-studied-time'],
      queryFn: () => getMonthlyStatisticsApi(year, month)
    });
    
    openModal({
      Component: MonthlyStudiedStatisticsModal,
      props: {
        year,
        month,
        monthData
      }
    });
  }, [month, openModal, queryClient, year]);

  return (
    <div>
      <Button onClick={openMonthlyStatistics} loading={isLoading}>Monthly Statistics</Button>
    </div>
  );
}
