'use client';

import {useEffect} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {getMonthlyStatisticsApi} from '@/utils/service/api/studied-time';
import {destructDate} from '@/utils/extend/date/util';
import {analyzeDifferenceMonthlyStatistics} from '@/utils/service/studied-time/statistics';
import {useOpenModal} from '@/utils/extend/modal';
import DisturbModal from '@/components/modal/studied-time/DisturbModal';

export default function DisturbSetting() {
  const {openModal} = useOpenModal();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const current = destructDate();
    const year = current.year;
    const month = current.month + 1;

    queryClient.fetchQuery({
      queryKey: ['daily-studied-time', year, month],
      queryFn: () => getMonthlyStatisticsApi(year, month)
    }).then(monthData => {
      const {weekday, holiday} = analyzeDifferenceMonthlyStatistics({monthData, month, year});
      const some = [weekday.averageStudied, weekday.totalStudied, holiday.averageStudied, holiday.totalStudied].some((pair) => pair.this < pair.previous);

      if (some) {
        openModal({
          Component: DisturbModal,
          props: {
            year,
            month,
            monthData
          }
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return null;
}