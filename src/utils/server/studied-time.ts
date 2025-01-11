import {sql} from '@vercel/postgres';
import {PostDailyStudyTimeParameter, UpdateDailyStudyTimeParameter} from '@/utils/service/api/studied-time';

export function insertStudiedTimeCalendar(user_id: string, parameter: PostDailyStudyTimeParameter) {
  const {fail_keywords = [], studied_minutes, date_type, year, month, date, wake_up_time, bed_time} = parameter;
  const timestamp = convertStudiedTimeTimestamp(year, month, date);
  const formattedStudiedMinutes = `{${studied_minutes.join(',')}}`;
  const formattedFailKeywords = `{${fail_keywords.map(k => `"${k}"`).join(',')}}`;

  return sql`
        INSERT INTO studied_time (studied_minutes, fail_keywords, date_type, timestamp, user_id, wake_up_time, bed_time)
        VALUES (${formattedStudiedMinutes}, ${formattedFailKeywords}, ${date_type}, ${timestamp}, ${user_id}, ${wake_up_time}, ${bed_time})`;
}

export function patchStudiedTimeCalendar(pk: number, parameter: Omit<UpdateDailyStudyTimeParameter, 'pk'>) {
  const {fail_keywords = [], studied_minutes, date_type, timestamp, wake_up_time, bed_time} = parameter;

  const formattedStudiedMinutes = `{${studied_minutes.join(',')}}`;
  const formattedFailKeywords = `{${fail_keywords.map(key => `"${key}"`).join(',')}}`;

  return sql`
        UPDATE studied_time SET
          studied_minutes = ${formattedStudiedMinutes},
          fail_keywords = ${formattedFailKeywords},
          date_type = ${date_type},
          timestamp = ${timestamp},
          wake_up_time = ${wake_up_time},
          bed_time = ${bed_time}
        WHERE
          pk = ${pk}
    `;
}

export function convertStudiedTimeTimestamp(year: number, month: number, date: number) {
  return new Date(`${year}-${month}-${date} 13:00:00`).getTime();
}
