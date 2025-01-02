import {HabitRoutineStep, LinkRoutineStep, PureRoutineStep} from '@/types/routine';
import {sql} from '@vercel/postgres';

export interface InsertRoutineStepParam {
  routine_id: number;
  order: number;
  step: PureRoutineStep;
  user_id: string;
}

export async function insertRoutineStep({order, routine_id, step, user_id}: InsertRoutineStepParam) {
  await sql`INSERT INTO routine_steps (routine_id, "order", type, url, text, keyword, user_id)
      VALUES (${routine_id}, ${order}, ${step.type}, ${(step as LinkRoutineStep).url ?? ''}, ${(step as LinkRoutineStep).text ?? ''}, ${(step as HabitRoutineStep).keyword ?? ''}, ${user_id})`;
}
