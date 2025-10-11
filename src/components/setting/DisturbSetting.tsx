'use client';

import {useEffect} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {getMonthlyStatisticsApi} from '@/utils/service/api/studied-time';
import {destructDate} from '@forworkchoe/core/utils';
import {analyzeDifferenceMonthlyStatistics} from '@/utils/service/studied-time/statistics';
import {useModal} from '@forworkchoe/core/hooks';
import DisturbModal from '@/components/modal/studied-time/DisturbModal';
import {getIsRoutineProcessing} from '@/utils/service/api/routine-client';

export default function DisturbSetting() {
  const modal = useModal();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const current = destructDate();
    const year = current.year;
    const month = current.month + 1;

    (async () => {
      const [monthData, isRoutineProcessing] = await Promise.all([queryClient.fetchQuery({
        queryKey: ['daily-studied-time', year, month],
        queryFn: () => getMonthlyStatisticsApi(year, month)
      }), getIsRoutineProcessing()]);

      const {weekday, holiday} = analyzeDifferenceMonthlyStatistics({monthData, month, year});
      const isStudyingTimeDecreased = [weekday.averageStudied, weekday.totalStudied, holiday.averageStudied, holiday.totalStudied].some((pair) => pair.this < pair.previous);

      if (isStudyingTimeDecreased || !isRoutineProcessing) {
        modal.open.custom({
          Component: DisturbModal,
          props: {
            year,
            month,
            monthData
          }
        });
      }
    })().then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return null;
}