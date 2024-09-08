import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {PostHabitRequest} from '@/utils/service/api/habit';

/**
 * 기능 = 내 습관 1개 통째로 업데이트하는거
 * 401 = user_id가 헤더에 없거나, 기존 습관의 user_id와 다르거나, 존재하지 않는 회원
 * 400 = parameter중 필수인 값이 일부 없거나 데이터타입이 유효허지않음.
 * 404 = pk가 존재하지않음
 */
export async function PATCH(request: NextRequest, {params: {pk}}: {params: {pk: string}}) {
  const {achieve_price, not_achieve_price, content, title, frequency, children} = await request.json() as PostHabitRequest;

    try {
      await sql`
        UPDATE original_habit SET
          title = ${title},
          achieve_price = ${achieve_price},
          content = ${content},
          not_achieve_price = ${not_achieve_price},
          frequency = ${frequency},
          children = ${JSON.stringify(children)}
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
 * 기능 = 내 습관 1개 삭제하기
 * 401 = user_id가 헤더에 없거나, 기존 습관의 user_id와 다르거나, 존재하지 않는 회원
 * 400 = pk 타입이 유효하지 않은경우 (숫자만 허용)
 * 404 = pk가 존재하지않음
 */
export async function DELETE(_: NextRequest, {params: {pk}}: {params: {pk: string}}) {
  try {
    await sql`DELETE FROM original_habit where pk=${pk}`;
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}
