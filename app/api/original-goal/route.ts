import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';

export async function POST(request: NextRequest) {
  const {title, content, achieve_price, not_achieve_price, frequency, is_important} = await request.json();
  const user_id = request.headers.get('User-Id');

  try {
    await sql`
INSERT INTO original_goal (user_id, title, content, achieve_price, not_achieve_price, frequency, is_important)
VALUES (${user_id}, ${title}, ${content}, ${achieve_price}, ${not_achieve_price}, ${frequency}, ${is_important});
`;
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}
