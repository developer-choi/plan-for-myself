import {DailyStudyTime} from '@/types/studied-time';
import {customFetchOnClientSide, customFetchOnServerSide} from '@/utils/extend/fetch';
import {CalendarDate, getCalendarWeekList, getMonthBoundary} from '@/utils/extend/date/calendar';
import {isSameDate} from '@/utils/extend/date/util';

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

export async function getStudiedTimeApi(year: number, month: number) {
  // const {start, end} = getCalendarBoundary(year, month); 달력에는 포함되지만 저번달이나 다음달 내용은 그냥 데이터 요청자체를 안하기로함.
  const {start, end} = getMonthBoundary(year, month);

  const {json} = await customFetchOnClientSide(`/api/studied-time?start=${formatter(start)}&end=${formatter(end)}`, {
    authorize: 'private',
    method: 'GET'
  });

  return json as DailyStudyTime[];
}

export interface StudiedTimeCalendarWeek {
  calendarDate: CalendarDate;
  data?: DailyStudyTime; // 해당 날짜에 공부한 기록이 없으면 없음
}

export async function getStudiedTimeCalendarApi(year: number, month: number): Promise<StudiedTimeCalendarWeek[][]> {
  const {start, end} = getMonthBoundary(year, month);

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
      data: matchData,
    };
  });
}

function formatter(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
