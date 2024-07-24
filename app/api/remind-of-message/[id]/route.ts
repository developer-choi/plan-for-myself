import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';

export async function DELETE(_: NextRequest, {params: {id}}: {params: {id: string}}) {
  try {
    await sql`DELETE FROM remind_me_of_message WHERE id = ${id};`;
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}
