import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    await sql`
INSERT INTO original_goal (user_id, title, content, achieve_price, not_achieve_price, frequency, is_important)
VALUES ('forworkchoe@gmail.com', '제목', '내용', 1000, 100, 'Daily', true);
`;
  } catch (error) {
    console.error(error);
  }

  return new Response('');
}
