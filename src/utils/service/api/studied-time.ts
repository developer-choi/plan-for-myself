import {DailyStudyTime} from '@/types/studied-time';
import {customFetchOnClientSide} from '@/utils/extend/fetch';
import {CalendarDate, getCalendarBoundary, getCalendarWeekList} from '@/utils/extend/date/calendar';
import {isSameDate} from '@/utils/extend/date/util';
import {customFetchOnServerSide} from '@/utils/extend/fetch';

export type PostDailyStudyTimeParameter = Omit<DailyStudyTime, 'pk'>;

export async function postStudiedTimeApi(parameter: PostDailyStudyTimeParameter) {
  return customFetchOnClientSide('/api/studied-time', {
    method: 'POST',
    authorize: 'private',
    body: parameter
  });
}

export type UpdateDailyStudyTimeParameter = DailyStudyTime;

export async function patchStudiedTimeApi(parameter: UpdateDailyStudyTimeParameter) {
  return customFetchOnClientSide('/api/studied-time', {
    method: 'PATCH',
    authorize: 'private',
    body: parameter
  });
}

export async function deleteStudiedTimeApi(pk: DailyStudyTime['pk']) {
  return customFetchOnClientSide(`/api/studied-time/${pk}`, {
    method: 'DELETE',
    authorize: 'private',
  });
}

export interface StudiedTimeHistory {
  calendarDate: CalendarDate;
  data?: DailyStudyTime; // 해당 날짜에 공부한 기록이 없으면 없음
}

export async function getStudiedTimeHistoryApi(year: number, month: number): Promise<StudiedTimeHistory[][]> {
  const {start, end} = getCalendarBoundary(year, month);

  const {json} = await customFetchOnServerSide(`/api/studied-time?start=${formatter(start)}&end=${formatter(end)}`, {
    authorize: 'private',
    method: 'GET'
  });

  return getCalendarWeekList(year, month, function (calendarDate) {
    const matchData = !calendarDate.state.calendar.isMatchedMonth ? undefined : (json as DailyStudyTime[]).find(({timestamp}) => {
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
