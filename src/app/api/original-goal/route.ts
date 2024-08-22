import {NextRequest} from 'next/server';
import {postOriginalGoalSql} from '@/utils/service/api/server';

/**
 * 기능 = 목표 1개 생성하기
 * 401 = user_id가 헤더에 없거나, 존재하지 않는 회원
 * 400 = goal 데이터중 일부가 유효하지않은 경우
 */
export async function POST(request: NextRequest) {
  const goal = await request.json();
  const user_id = request.headers.get('User-Id') as string;

  try {
    await postOriginalGoalSql(user_id, goal);
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}
