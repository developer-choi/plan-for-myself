'use client';

import {useModal} from '@forworkchoe/core/hooks';
import Button from '@/components/element/Button';
import {useCallback} from 'react';
import MonthlyStudiedStatisticsModal from '@/components/modal/studied-time/MonthlyStudiedStatisticsModal';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getMonthlyStatisticsApi} from '@/utils/service/api/studied-time';

export interface StudiedStatisticsProps {
  year: number;
  month: number;
}

export default function StudiedStatistics({year, month}: StudiedStatisticsProps) {
  const modal = useModal();

  const {isLoading} = useQuery({
    queryKey: ['daily-studied-time', year, month],
    enabled: false
  });

  const queryClient = useQueryClient();

  const openMonthlyStatistics = useCallback(async () => {
    const monthData = await queryClient.fetchQuery({
      queryKey: ['daily-studied-time', year, month],
      queryFn: () => getMonthlyStatisticsApi(year, month),
      staleTime: 0
    });

    modal.open.custom({
      Component: MonthlyStudiedStatisticsModal,
      props: {
        year,
        month,
        monthData
      }
    });
  }, [modal.open, month, queryClient, year]);

  return (
    <div>
      <Button onClick={openMonthlyStatistics} loading={isLoading}>Monthly Statistics</Button>
    </div>
  );
}
