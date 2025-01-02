import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {listToDateTypeRecord} from '@/utils/service/date-type';
import {ReadableRoutine} from '@/types/routine';
import {UpdateRoutineListOrderApiRequest} from '@/utils/service/api/routine';

export async function GET(request: NextRequest) {
  const user_id = request.headers.get('User-Id');

  try {
    const response = await sql`
    SELECT 
      r.id AS id,
      r.title,
      r.date_type,
      r.routine_type,
      JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', rs.id,
              'type', rs.type,
              'url', rs.url,
              'text', rs.text,
              'keyword', rs.keyword
          )
      ) AS steps
    FROM routines r
    LEFT JOIN routine_steps rs ON r.id = rs.routine_id
    WHERE r.user_id = ${user_id}
    GROUP BY r.id
    ORDER BY r."order"`;
    return Response.json(listToDateTypeRecord(response.rows as ReadableRoutine[]));
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}

export async function PATCH(request: NextRequest) {
  const user_id = request.headers.get('User-Id');
  const body = await request.json() as UpdateRoutineListOrderApiRequest;

  try {
    for(const index of body.keys()) {
      const id = body[index];

      await sql`
        UPDATE routines SET
          "order" = ${index + 1}
        WHERE
          id = ${id}
          AND user_id = ${user_id}
    `;
    }
    return new Response('');
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}
