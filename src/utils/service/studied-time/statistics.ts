import {DailyStudyTime, DailyStudyTimeDateType} from '@/types/studied-time';
import {calculateTotal} from '@/utils/extend/data-type/number';
import {getDaysInMonth} from '@/utils/extend/date/calendar';

export interface DifferenceMonthlyStatisticsParam {
  year: number;
  month: number;
  monthData: {
    this: DailyStudyTime[];
    previous: DailyStudyTime[];
  };
}

export interface DifferenceMonthlyStatisticsResult extends MonthlyDifferenceStudiedTime {
  adjusted: boolean; // 비교 값 환산 여부. 전달한 달이 현재 날짜의 달이면서, 아직 말일이 지나지 않은경우 저번달 값을 보정한 상태로 값을 비교함.
}

export function analyzeDifferenceMonthlyStatistics({year, month, monthData}: DifferenceMonthlyStatisticsParam): DifferenceMonthlyStatisticsResult {
  const current = new Date();

  /**
   * 반드시, 현재 연월과 전달받은 연월이 같으면서, 현재 연월이 아직 말일이 안된 경우에만 보정을 했음.
   * >> 과거 기록 조회하던중 그냥 단순히 과거에 공부를 덜했는데도 보정해서 그 전달과 비교가 된다면 말이안되기 때문.
   */
  const adjusted = (current.getFullYear() === year) && (current.getMonth() + 1 === month) && (current.getDate() < getDaysInMonth(year, month));

  const thisMonthSummary = getMonthlyStatisticsSummary(monthData.this);
  const previousMonthSummary = getMonthlyStatisticsSummary(monthData.previous);

  return {
    adjusted,
    weekday: {
      totalStudied: {
        this: thisMonthSummary.weekday.totalStudied,
        // 보정이 필요한 경우, 직전 달의 평균값에 이번 달의 평일갯수를 곱해서 비교를 하는데 사용.
        previous: !adjusted ? previousMonthSummary.weekday.totalStudied : previousMonthSummary.weekday.averageStudied * thisMonthSummary.weekday.totalCount
      },
      averageStudied: {
        this: thisMonthSummary.weekday.averageStudied,
        previous: previousMonthSummary.weekday.averageStudied
      }
    },
    holiday: {
      totalStudied: {
        this: thisMonthSummary.holiday.totalStudied,
        // 보정이 필요한 경우, 직전 달의 평균값에 이번 달의 휴일갯수를 곱해서 비교를 하는데 사용.
        previous: !adjusted ? previousMonthSummary.holiday.totalStudied : previousMonthSummary.holiday.averageStudied * thisMonthSummary.holiday.totalCount
      },
      averageStudied: {
        this: thisMonthSummary.holiday.averageStudied,
        previous: previousMonthSummary.holiday.averageStudied
      }
    }
  };
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
interface StudiedTimeStatistics {
  totalCount: number;
  totalStudied: number; // (평일 or 휴일) 공부시간 총합, 단위 minutes
  averageStudied: number; // (평일 or 휴일) 공부시간 평균, 단위 minutes
}

type MonthlyStudiedTimeStatistics = Record<DailyStudyTimeDateType, StudiedTimeStatistics>;

function getMonthlyStatisticsSummary(data: DailyStudyTime[]): MonthlyStudiedTimeStatistics {
  const {total, count} = data.reduce((a, b) => {
    const key = b.date_type === 'weekday' ? 'weekday' : 'holiday';
    a.total[key] += calculateTotal(b.studied_minutes, value => value);
    a.count[key]++;
    return a;
  }, {total: {weekday: 0, holiday: 0}, count: {weekday: 0, holiday: 0}});

  const averageDuringHoliday = Math.floor(total.holiday / count.holiday);
  const averageDuringWeekday = Math.floor(total.weekday / count.weekday);

  return {
    weekday: {
      totalStudied: total.weekday,
      totalCount: count.weekday,
      // 0/0 = NaN
      averageStudied: Number.isNaN(averageDuringWeekday) ? 0 : averageDuringWeekday
    },
    holiday: {
      totalStudied: total.holiday,
      totalCount: count.holiday,
      // 0/0 = NaN
      averageStudied: Number.isNaN(averageDuringHoliday) ? 0 : averageDuringHoliday
    }
  };
}

interface DifferenceStudiedTime {
  this: number; // 이번 달 (평균 or 총합) 공부시간
  previous: number; // 저번 달 (평균 or 총합) 공부시간
}

type MonthlyDifferenceStudiedTime = Record<DailyStudyTimeDateType, {
  totalStudied: DifferenceStudiedTime;
  averageStudied: DifferenceStudiedTime;
}>;
