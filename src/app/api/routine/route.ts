import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {PostRoutineApiRequest} from '@/utils/service/api/routine';
import {insertRoutineStep} from '@/utils/server/routine-step';

export async function POST(request: NextRequest) {
  const routine = await request.json() as PostRoutineApiRequest;
  const user_id = request.headers.get('User-Id') as string;

  try {
    const response = await sql`
      INSERT INTO routines (title, date_type, routine_type, user_id, "order")
      VALUES (${routine.title}, ${routine.date_type}, ${routine.routine_type}, ${user_id}, COALESCE((SELECT MAX("order") + 1 FROM routines WHERE user_id = ${user_id}), 1))
      RETURNING id`;

    const routine_id = response.rows[0].id;

    // 다중 INSERT문 아무리 해도 안되더라 $1 오류뜸 ㅠㅠ
    for(const index of routine.steps.keys()) {
      const step = routine.steps[index];
      await insertRoutineStep({
        user_id,
        step,
        routine_id,
        order: index + 1
      });
    }

    return new Response('');
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}
