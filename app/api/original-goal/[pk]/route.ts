import {NextRequest} from 'next/server';
import type {PostGoalRequestParameter} from '@/type/goal-server';
import {sql} from '@vercel/postgres';

/**
 * 기능 = 내 목표 1개 통째로 업데이트하는거
 * 401 = user_id가 헤더에 없거나, 기존 목표의 user_id와 다르거나, 존재하지 않는 회원
 * 400 = parameter중 필수인 값이 일부 없거나 데이터타입이 유효허지않음.
 * 404 = pk가 존재하지않음
 */
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


/**
 * 기능 = 내 목표 1개 삭제하기
 * 401 = user_id가 헤더에 없거나, 기존 목표의 user_id와 다르거나, 존재하지 않는 회원
 * 400 = pk 타입이 유효하지 않은경우 (숫자만 허용)
 * 404 = pk가 존재하지않음
 */
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
