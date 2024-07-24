import {Goal} from '@/type/goal';
import {sql} from '@vercel/postgres';

export async function postOriginalGoalSql(user_id: string, {title, content, achieve_price, not_achieve_price, frequency, is_important}: Goal) {
  await sql`
INSERT INTO original_goal (user_id, title, content, achieve_price, not_achieve_price, frequency, is_important)
VALUES (${user_id}, ${title}, ${content}, ${achieve_price}, ${not_achieve_price}, ${frequency}, ${is_important});
`;
}
