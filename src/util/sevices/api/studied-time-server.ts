import {CalendarDate, getCalendarBoundary, getCalendarWeekList} from '@/util/extend/date/calendar';
import {DailyStudyTime} from '@/type/studied-time';
import {isSameDate} from '@/util/extend/date/util';
import {customFetchInServerSide} from '@/util/extend/api/server';

export interface StudiedTimeHistory {
  calendarDate: CalendarDate;
  data?: DailyStudyTime; // 해당 날짜에 공부한 기록이 없으면 없음
}

export async function getStudiedTimeHistoryApi(year: number, month: number): Promise<StudiedTimeHistory[][]> {
  const {startOfMonth, endOfMonth} = getCalendarBoundary(year, month);

  const {json} = await customFetchInServerSide(`/api/studied-time?start=${formatter(startOfMonth)}&end=${formatter(endOfMonth)}`, {
    authorize: 'private',
    method: 'GET'
  });

  return getCalendarWeekList(year, month, function (calendarDate) {
    const matchData = (json as DailyStudyTime[]).find(({timestamp}) => {
      return isSameDate(new Date(timestamp), calendarDate.original);
    });

    return {
      calendarDate,
      data: matchData
    };
  });
}

function formatter(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}