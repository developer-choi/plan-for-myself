import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {UpdateDailyStudyTimeParameter} from '@/utils/service/api/studied-time';

// user_id 비교해서 맞는사람인 경우에만 허용
export async function DELETE(_: NextRequest, {params: {pk}}: {params: {pk: string}}) {
  try {
    await sql`
        delete from studied_time
        WHERE
          pk = ${pk}
    `;

    return new Response('');

  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}


// user_id 비교해서 맞는사람인 경우에만 허용
export async function PATCH(request: NextRequest, {params: {pk}}: {params: {pk: string}}) {
  const parameter: Omit<UpdateDailyStudyTimeParameter, 'pk'> = await request.json();
  const {fail_keywords = [], fail_reason = '', studied_minutes, date_type, timestamp, wake_up_time, bed_time} = parameter;

  const formattedStudiedMinutes = `{${studied_minutes.join(',')}}`;
  const formattedFailKeywords = `{${fail_keywords.map(key => `"${key}"`).join(',')}}`;

  try {
    await sql`
        UPDATE studied_time SET
          studied_minutes = ${formattedStudiedMinutes},
          fail_keywords = ${formattedFailKeywords},
          fail_reason = ${fail_reason},
          date_type = ${date_type},
          timestamp = ${timestamp},
          wake_up_time = ${wake_up_time},
          bed_time = ${bed_time}
        WHERE
          pk = ${pk}
    `;

    return new Response('');

  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}
