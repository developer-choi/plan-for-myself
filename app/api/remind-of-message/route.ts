import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {RemindOfMessageItem} from '@util/sevices/api/remind-of-message';

export async function POST(request: NextRequest) {
  const {message} = await request.json();
  const user_id = request.headers.get('User-Id') as string;

  try {
    await sql`INSERT INTO remind_me_of_message (user_id, message) VALUES (${user_id}, ${message});`;
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}

export async function GET(request: NextRequest) {
  const user_id = request.headers.get('User-Id') as string;

  try {
    const {rows} = await sql`SELECT id, message FROM remind_me_of_message WHERE user_id = ${user_id};`;
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}

export async function PATCH(request: NextRequest) {
  const {id, message} = await request.json() as RemindOfMessageItem;
  // 원래는 user_id가 같은지도 체크해야함.

  try {
    await sql`UPDATE remind_me_of_message 
SET message = ${message} 
WHERE id = ${id};`;
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}
