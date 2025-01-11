import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {ProcessableRoutine} from '@/types/routine';
import {ROUTINE_PROCESSING_ERROR} from '@/utils/service/constant/routine';
import {PostRoutineApiRequest} from '@/utils/service/api/routine';
import {listToDateTypeRecord} from '@/utils/service/date-type';
import {insertRoutineStep} from '@/utils/server/routine-step';

export async function DELETE(request: NextRequest) {
  const user_id = request.headers.get('User-Id');

  try {
    await sql`DELETE FROM routine_logs WHERE user_id = ${user_id}`;
    return new Response('');
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}

export async function GET(request: NextRequest) {
  const user_id = request.headers.get('User-Id');

  try {
    await sql`DELETE FROM routine_logs WHERE TO_TIMESTAMP(created_at)::DATE != CURRENT_DATE AND user_id = ${user_id}`;

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
          'url', COALESCE(rs.url, 'empty'),  -- NULL 값을 'empty'로 대체
          'text', COALESCE(rs.text, 'empty'),
          'keyword', COALESCE(rs.keyword, 'empty'),
          'is_processed', 
          CASE 
            WHEN rl.routine_step_id IS NOT NULL THEN TRUE
            ELSE FALSE
          END,
          'studied_minutes', COALESCE(rl.studied_minutes, 0),
          'sleep_time', COALESCE(rl.sleep_time, '')
      ) 
      ORDER BY rs."order"
  ) AS steps
FROM routines r
LEFT JOIN routine_steps rs ON r.id = rs.routine_id
LEFT JOIN routine_logs rl 
    ON rs.id = rl.routine_step_id
WHERE r.user_id = ${user_id}
GROUP BY r.id
ORDER BY r."order"`;

    // 실제로는 is_processing이라는 값은 아직 안만들어서 없음
    const list = (response.rows as ProcessableRoutine[]).map<ProcessableRoutine>(routine => ({
      ...routine,
      steps: routine.steps.map(step => ({
        ...step,
        is_processing: false // 기본값
      }))
    }));

    // 애초에 루틴이 하나도 없는경우 ==> 루틴을 만들어야함
    if (list.length === 0) {
      return Response.json({
        state: ROUTINE_PROCESSING_ERROR.routine_is_empty
      }, {
        status: 404
      });
    }

    const hasLogs = await sql`
WITH latest_log AS (
    SELECT routine_step_id
    FROM routine_logs
    WHERE user_id = ${user_id}
    ORDER BY created_at DESC
    LIMIT 1
)
SELECT r.date_type
FROM routines r
JOIN routine_steps rs ON rs.routine_id = r.id
JOIN latest_log ll ON rs.id = ll.routine_step_id;
    `;

    // 애초에 오늘 루틴자체를 시작 안한 경우, 택1하면됨
    if (hasLogs.rows.length === 0) {
      const record = listToDateTypeRecord(list);

      Object.entries(record).forEach(([, list]) => {
        if (list.length > 0) {
          const firstStep = list[0].steps[0];

          if (firstStep) {
            firstStep.is_processing = true;
          }
        }
      });

      return Response.json({
        state: ROUTINE_PROCESSING_ERROR.select_date_type,
        record
      }, {
        status: 404
      });
    }

    let foundedIndex: null | {routine: number, step: number;} = null;

    const todayRoutineList = list.filter(({date_type}) => hasLogs.rows[0].date_type === date_type);

    if (todayRoutineList.length === 0) {
      return new Response('오늘 루틴을 진행한 기록은 있는데, 그 루틴의 date_type과 일치하는 루틴 리스트가 없음.', {
        status: 500
      });
    }

    for(const routineIndex of todayRoutineList.keys()) {
      const routine = list[routineIndex];

      for(const stepIndex of routine.steps.keys()) {
        if (!todayRoutineList[routineIndex].steps[stepIndex].is_processed) {
          foundedIndex = {
            step: stepIndex,
            routine: routineIndex
          };
          break;
        }
      }

      if (foundedIndex) {
        break;
      }
    }

    if (foundedIndex) {
      const result: ProcessableRoutine = {
        ...todayRoutineList[foundedIndex.routine],
        steps: todayRoutineList[foundedIndex.routine].steps.map((step, index) => ({
          ...step,
          is_processing: foundedIndex.step === index
        })),
      };

      return Response.json(result);
    } else {
      return Response.json({
        state: ROUTINE_PROCESSING_ERROR.all_done
      }, {
        status: 404
      });
    }
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}

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
