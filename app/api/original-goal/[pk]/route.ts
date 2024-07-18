import {NextRequest} from 'next/server';
import type {PostGoalRequestParameter} from '@type/goal-server';
import {sql} from '@vercel/postgres';

export async function PATCH(request: NextRequest, {params: {pk}}: {params: {pk: string}}) {
  const {achieve_price, not_achieve_price, content, title, frequency} = await request.json() as PostGoalRequestParameter;

    try {
      await sql`
        UPDATE original_goal SET
          title = ${title},
          achieve_price = ${achieve_price},
          content = ${content},
          not_achieve_price = ${not_achieve_price},
          frequency = ${frequency}
        WHERE
          pk = ${pk}
    `;
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}

export async function DELETE(_: NextRequest, {params: {pk}}: {params: {pk: string}}) {
  try {
    await sql`DELETE FROM original_goal where pk=${pk}`;
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}
