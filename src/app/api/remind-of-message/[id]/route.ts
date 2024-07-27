import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';

/**
 * 기능 = 리마인드 메시지 1개 생성하기
 * 401 = user_id가 헤더에 없거나, 원래 작성자와 다르거나, 존재하지 않는 회원
 * 400 = id가 유효하지 않은경우 (숫자만 허용)
 * 404 = message가 존재하지않음
 */
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
