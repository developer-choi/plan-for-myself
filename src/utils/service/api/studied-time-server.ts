import {DailyStudyTime} from '@/types/studied-time';
import {CalendarDate, getCalendarBoundary, getCalendarWeekList} from '@forworkchoe/core/utils';
import {isSameDate} from '@/utils/extend/date/util';
import {fetchFromServer} from '@/utils/extend/library/fetch/fromServer';
import {dateFormatter} from '@/utils/server/studied-time';

export interface StudiedTimeCalendarWeek {
  calendarDate: CalendarDate;
  data?: DailyStudyTime; // 해당 날짜에 공부한 기록이 없으면 없음
}

export async function getStudiedTimeCalendarApi(year: number, month: number): Promise<StudiedTimeCalendarWeek[][]> {
  const {start, end} = getCalendarBoundary(year, month);

  const {data} = await fetchFromServer<DailyStudyTime[]>(`/api/studied-time?start=${dateFormatter(start)}&end=${dateFormatter(end)}`, {
    authPolicy: 'private',
    method: 'GET',
    next: {
      tags: ['STUDIED_TIME_CALENDAR']
    }
  });

  return getCalendarWeekList(year, month, function (calendarDate) {
    const matchData = data.find(({timestamp}) => {
      return isSameDate(new Date(timestamp), calendarDate.original);
    });

    return {
      calendarDate,
      data: matchData,
    };
  });
}
