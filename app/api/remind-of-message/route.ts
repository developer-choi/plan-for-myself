import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {RemindOfMessageItem} from '@/util/sevices/api/remind-of-message';

/**
 * 기능 = 리마인드 메시지 1개 생성하기
 * 401 = user_id가 헤더에 없거나, 존재하지 않는 회원
 * 400 = message 데이터중 일부가 유효하지않은 경우
 */
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

/**
 * 기능 = 리마인드 메시지 배열 가져오기
 * 401 = user_id가 헤더에 없거나, 존재하지 않는 회원
 */
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

/**
 * 기능 = 리마인드 메시지 1개 생성하기
 * 401 = user_id가 헤더에 없거나, 원래 작성자와 다르거나, 존재하지 않는 회원
 * 400 = message 데이터중 일부가 유효하지않은 경우
 * 404 = message가 존재하지않음
 */
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
