import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {Goal} from '@type/goal';

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

export async function postOriginalGoalSql(user_id: string, {title, content, achieve_price, not_achieve_price, frequency, is_important}: Goal) {
  await sql`
INSERT INTO original_goal (user_id, title, content, achieve_price, not_achieve_price, frequency, is_important)
VALUES (${user_id}, ${title}, ${content}, ${achieve_price}, ${not_achieve_price}, ${frequency}, ${is_important});
`;
}
