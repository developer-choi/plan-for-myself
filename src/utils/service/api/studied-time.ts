import {DailyStudyTime} from '@/types/studied-time';
import {fetchFromClient} from '@/utils/extend/library/fetch/fromClient';
import {getCalendarNavigation, getMonthBoundary} from '@forworkchoe/core/utils';
import {dateFormatter} from '@/utils/server/studied-time';

export interface PostDailyStudyTimeParameter extends Omit<DailyStudyTime, 'pk' | 'timestamp'> {
  year: number;
  month: number;
  date: number;
}

export async function postStudiedTimeApi(parameter: PostDailyStudyTimeParameter) {
  return fetchFromClient('/api/studied-time', {
    method: 'POST',
    authPolicy: 'private',
    body: parameter
  });
}

export type UpdateDailyStudyTimeParameter = DailyStudyTime;

export async function patchStudiedTimeApi({pk, ...parameter}: UpdateDailyStudyTimeParameter) {
  return fetchFromClient(`/api/studied-time/${pk}`, {
    method: 'PATCH',
    authPolicy: 'private',
    body: parameter
  });
}

export async function deleteStudiedTimeApi(pk: DailyStudyTime['pk']) {
  return fetchFromClient(`/api/studied-time/${pk}`, {
    method: 'DELETE',
    authPolicy: 'private',
  });
}

export async function getMonthlyStatisticsApi(year: number, month: number) {
  const {previousCalendar} = getCalendarNavigation(year, month);

  const [thisMonthResponse, previousMonthResponse] = await Promise.all([
    getStudiedTimeApi(year, month),
    getStudiedTimeApi(previousCalendar.year, previousCalendar.month)
  ]);

  return {
    this: thisMonthResponse,
    previous: previousMonthResponse
  }
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
async function getStudiedTimeApi(year: number, month: number) {
  const {start, end} = getMonthBoundary(year, month);

  const {data} = await fetchFromClient<DailyStudyTime[]>(`/api/studied-time?start=${dateFormatter(start)}&end=${dateFormatter(end)}`, {
    authPolicy: 'private',
    method: 'GET',
    next: {
      tags: ['STUDIED_TIME_CALENDAR']
    }
  });

  return data;
}
