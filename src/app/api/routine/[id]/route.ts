import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {HabitRoutineStep, LinkRoutineStep, ReadableRoutine, ReadableRoutineStep} from '@/types/routine';
import {UpdateRoutineApiRequest} from '@/utils/service/api/routine';
import {insertRoutineStep} from '@/utils/server/routine-step';

export async function DELETE(request: NextRequest, {params: {id}}: {params: {id: string}}) {
  const user_id = request.headers.get('User-Id') as string;

  try {
    await sql`delete from routines where user_id=${user_id} AND id=${id}`;
    return new Response('');
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}

export async function GET(request: NextRequest, {params: {id}}: {params: {id: string}}) {
  const user_id = request.headers.get('User-Id') as string;

  try {
    const routine = await getReadableRoutine(user_id, id);

    if (!routine) {
      return new Response('', {
        status: 404
      });
    }

    return Response.json(routine);
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}

export async function PATCH(request: NextRequest, {params: {id}}: {params: {id: string}}) {
  const user_id = request.headers.get('User-Id') as string;
  const {steps, title, date_type, routine_type} = await request.json() as UpdateRoutineApiRequest;

  console.log(`### PATCH /api/routine/${id} API called ###`);

  try {
    const originalRoutine = await getReadableRoutine(user_id, id);

    if (!originalRoutine) {
      return new Response('', {
        status: 404
      });
    }

    console.log('### original routine get success ###');

    await sql`
        UPDATE routines SET
          title = ${title},
          date_type = ${date_type},
          routine_type = ${routine_type}
        WHERE
          id = ${id}
          AND user_id = ${user_id}
    `;

    console.log('#### update routine success ####');

    const remainStepIds = steps.map(({id}) => id).filter(id => !!id) as number[];
    const toDeleteSteps: ReadableRoutineStep[] = originalRoutine.steps.filter(step => !remainStepIds.includes(step.id));

    for (const toDeleteStep of toDeleteSteps) {
      await sql`delete from routine_steps where id=${toDeleteStep.id} AND user_id=${user_id}`;
    }

    if (toDeleteSteps.length) {
      console.log('#### delete routine_steps success ####');
    }

    for(const index of steps.keys()) {
      const step = steps[index];
      const order = index + 1;

      if (step.id) {
        await sql`
        UPDATE routine_steps SET
          "order" = ${order},
          type = ${step.type},
          url = ${(step as LinkRoutineStep).url},
          text = ${(step as LinkRoutineStep).text},
          keyword = ${(step as HabitRoutineStep).keyword}
        WHERE
          id = ${step.id}
          AND user_id = ${user_id}
    `;
        console.log(`#### update routine_steps success - ${step.id} ####`);
      } else {
        await insertRoutineStep({
          user_id,
          step,
          routine_id: Number(id),
          order: order
        });
        console.log(`#### insert routine_steps success - ${JSON.stringify(step)} ####`);
      }
    }

  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }

  return new Response('');
}

async function getReadableRoutine(user_id: string, id: string | number) {
  const response = await sql`
    SELECT 
      r.id AS id,
      r.title,
      r.date_type,
      r.routine_type,
      JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', rs.id,
              'type', rs.type,
              'url', rs.url,
              'text', rs.text,
              'keyword', rs.keyword
          )
          ORDER BY rs."order"  -- order 컬럼 기준으로 정렬
      ) AS steps
FROM routines r
LEFT JOIN routine_steps rs ON r.id = rs.routine_id
WHERE r.user_id = ${user_id}
AND r.id = ${id}
GROUP BY r.id
ORDER BY r.id`;

  const rows = response.rows as ReadableRoutine[];
  return rows[0] as ReadableRoutine | undefined;
}
