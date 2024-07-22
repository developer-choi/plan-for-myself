import {NextRequest} from 'next/server';
import {postOriginalGoalSql} from '@util/sevices/api/server';

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
