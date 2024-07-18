import {NextRequest} from 'next/server';
import {Goal} from '@type/goal';
import {postOriginalGoalSql} from '../route';

export async function POST(request: NextRequest) {
  const goalList = await request.json() as Goal[];
  const user_id = request.headers.get('User-Id') as string;

  try {
    for (const goal of goalList) {
      await postOriginalGoalSql(user_id, goal);
    }
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}
