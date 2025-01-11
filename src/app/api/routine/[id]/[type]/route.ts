import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import {FixedRoutineType, ProcessableRoutineStep, PureRoutineStep} from '@/types/routine';
import {ROUTINE_STEP_TYPE} from '@/utils/service/constant/routine';
import {
  PostHabitRoutineApiRequest,
  PostSleepTimeRoutineApiRequest,
  PostStudiedMinutesRoutineApiRequest
} from '@/utils/service/api/routine';
import {DateType} from '@/utils/service/constant/date-type';
import {insertStudiedTimeCalendar, patchStudiedTimeCalendar} from '@/utils/server/studied-time';
import {getKoreanDate} from '@/utils/extend/date/korean';
import {removeDuplicatedItems} from '@/utils/extend/data-type/array';

interface StudiedTimeDbRow {
  pk: number;
  timestamp: string;
  fail_keywords: string[];
  studied_minutes: [number, number, number];
  wake_up_time: string; // ex: hh:mm
  bed_time: string; // ex: hh:mm
  date_type: DateType;
}

export async function POST(request: NextRequest, {params: {id, type}}: {params: {id: string, type: string}}) {
  const numericId = Number(id);
  const stepType = type as ProcessableRoutineStep['type'];

  if (!ROUTINE_STEP_TYPE.includes(type as any)) {
    return new Response('', {
      status: 404
    });
  }

  try {
    const user_id = request.headers.get('User-Id') as string;
    const body = stepType === 'link' ? undefined : await request.json();

    await createRoutineLog({body, user_id}, numericId, stepType);

    if (stepType !== 'link') {
      await updateStudiedTimeCalendar({body, user_id}, numericId, stepType);
    }

    return new Response('');
  } catch (error) {
    console.error(error);

    if (error instanceof Response) {
      return error;
    } else {
      return new Response('', {
        status: 500
      });
    }
  }
}

async function createRoutineLog(data: {body: any, user_id: string}, id: number, type: ProcessableRoutineStep['type']) {
  const stepType = type as PureRoutineStep['type'];
  const {user_id, body} = data;

  switch (stepType) {
    case 'habit': {
      const {isAchieved} = body as PostHabitRoutineApiRequest;
      await sql`INSERT INTO routine_logs (routine_step_id, user_id, is_achieved) VALUES (${id}, ${user_id}, ${String(isAchieved)});`;
      break;
    }

    case 'sleep_time':
      const {sleep_time} = body as PostSleepTimeRoutineApiRequest;
      await sql`INSERT INTO routine_logs (routine_step_id, user_id, sleep_time) VALUES (${id}, ${user_id}, ${sleep_time});`;
      break;

    case 'link':
      await sql`INSERT INTO routine_logs (routine_step_id, user_id) VALUES (${id}, ${user_id});`;
      break;

    case 'studied_minutes': {
      const {studied_minutes} = body as PostStudiedMinutesRoutineApiRequest;
      await sql`INSERT INTO routine_logs (routine_step_id, user_id, studied_minutes) VALUES (${id}, ${user_id}, ${studied_minutes});`;
      break;
    }
  }
}

async function updateStudiedTimeCalendar(data: {body: any, user_id: string}, id: number, type: Exclude<ProcessableRoutineStep['type'], 'link'>) {
  const {user_id, body} = data;

  // TODO 한국시간 기준으로 조회하는거 나중에 다른데도 다 적용해야함. 너무 불편해; 한국에서만 쓸려고 만든건데 자꾸 UTC 기준으로 들어가는곳이 있더라.
  const {rows} = await sql`SELECT * 
FROM studied_time 
WHERE TO_CHAR((TO_TIMESTAMP(timestamp / 1000) AT TIME ZONE 'Asia/Seoul')::DATE, 'YYYY-MM-DD') = TO_CHAR(NOW() AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD')`;

  if (rows.length > 1) {
    throw new Response(`오늘 날짜로 생성된 studied time 기록이 ${rows.length}개 입니다. 1개만 남을 수 있도록 데이터를 수정해야합니다.`, {
      status: 500
    });
  }

  const todayRow = rows[0] as StudiedTimeDbRow | undefined;

  /**
   * 3. 오늘 날짜로 써져있는거 알아내서 수정하거나 생성하기
   */
  const response = await sql`SELECT rs.keyword,r.date_type,r.routine_type FROM  routine_steps rs JOIN  routines r ON rs.routine_id = r.id WHERE rs.id = ${id};`;
  const row = response.rows[0];

  if (!row) {
    throw new Response('해당 id와 일치하는 routine_step이 없습니다.', {
      status: 404
    });
  }

  const {date_type, keyword, routine_type} = row as {date_type: DateType, keyword: string, routine_type: FixedRoutineType};
  const {year, month, date} = getKoreanDate();

  switch (type) {
    case 'habit': {
      const {isAchieved} = body as PostHabitRoutineApiRequest;

      if (!todayRow) {
        await insertStudiedTimeCalendar(user_id, {
          fail_keywords: isAchieved ? [] : [keyword],
          year,
          month: month + 1,
          date,
          date_type,
          bed_time: '',
          wake_up_time: '',
          studied_minutes: [0, 0, 0]
        });
      } else {
        await patchStudiedTimeCalendar(todayRow.pk, {
          fail_keywords: isAchieved ? todayRow.fail_keywords : removeDuplicatedItems(todayRow.fail_keywords.concat(keyword)),
          studied_minutes: todayRow.studied_minutes,
          wake_up_time: todayRow.wake_up_time,
          bed_time: todayRow.bed_time,
          date_type: todayRow.date_type,
          timestamp: Number(todayRow.timestamp)
        });
      }
      return;
    }

    case 'studied_minutes': {
      const {studied_minutes} = body as PostStudiedMinutesRoutineApiRequest;

      if (!todayRow) {
        await insertStudiedTimeCalendar(user_id, {
          fail_keywords: [],
          year,
          month: month + 1,
          date,
          date_type,
          wake_up_time: '',
          bed_time: '',
          studied_minutes: [
            routine_type === 'morning' ? studied_minutes : 0,
            routine_type === 'lunch' ? studied_minutes : 0,
            routine_type === 'night' ? studied_minutes : 0
          ]
        });
      } else {
        await patchStudiedTimeCalendar(todayRow.pk, {
          fail_keywords: todayRow.fail_keywords,
          studied_minutes: [
            routine_type === 'morning' ? studied_minutes : todayRow.studied_minutes[0],
            routine_type === 'lunch' ? studied_minutes : todayRow.studied_minutes[1],
            routine_type === 'night' ? studied_minutes : todayRow.studied_minutes[2]
          ],
          wake_up_time: todayRow.wake_up_time,
          bed_time: todayRow.bed_time,
          date_type: todayRow.date_type,
          timestamp: Number(todayRow.timestamp)
        });
      }
      return;
    }

    case 'sleep_time': {
      const {sleep_time} = body as PostSleepTimeRoutineApiRequest;

      if (!todayRow) {
        await insertStudiedTimeCalendar(user_id, {
          fail_keywords: [],
          year,
          month: month + 1,
          date,
          date_type,
          wake_up_time: routine_type === 'morning' ? sleep_time : '',
          bed_time: routine_type === 'night' ? sleep_time : '',
          studied_minutes: [0, 0, 0]
        });
      } else {
        await patchStudiedTimeCalendar(todayRow.pk, {
          fail_keywords: todayRow.fail_keywords,
          studied_minutes: todayRow.studied_minutes,
          wake_up_time: routine_type === 'morning' ? sleep_time : todayRow.wake_up_time,
          bed_time: routine_type === 'night' ? sleep_time : todayRow.bed_time,
          date_type: todayRow.date_type,
          timestamp: Number(todayRow.timestamp)
        });
      }
      return;
    }
  }
}
