import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {Habit} from '@/types/habit';

/**
 * 기능 = 습관 1개 생성하기
 * 401 = user_id가 헤더에 없거나, 존재하지 않는 회원
 * 400 = habit 데이터중 일부가 유효하지않은 경우
 */
export async function POST(request: NextRequest) {
  const {memo, frequency_list, title, children} = await request.json() as Habit;
  const user_id = request.headers.get('User-Id') as string;

  try {
    await sql`
INSERT INTO original_habit (user_id, title, memo, frequency_list, children)
VALUES (${user_id}, ${title}, ${memo}, ${JSON.stringify(frequency_list)}, ${JSON.stringify(children)});
`;
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}
