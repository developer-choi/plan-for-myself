import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {UpdateDailyStudyTimeParameter} from '@/utils/service/api/studied-time';
import {patchStudiedTimeCalendar} from '@/utils/server/studied-time';

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

  try {
    await patchStudiedTimeCalendar(Number(pk), parameter)
    return new Response('');
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}
