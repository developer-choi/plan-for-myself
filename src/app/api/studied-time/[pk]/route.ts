import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';

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
