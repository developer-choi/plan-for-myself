import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import type {CheckableGoal, Goal, GoalFrequency} from '@/type/goal';
import dayjs from 'dayjs';
import type {GoalFullResponse} from '@/type/goal';

/**
 * 기능 = 내 목표목록, 오늘 체크한거 히스토리, 오늘 체크할 목표목록, 오늘의 빈도값 가져오기
 * 401 = user_id가 헤더에 없거나, 존재하지 않는 회원
 */
export async function GET(request: NextRequest) {
  const user_id = request.headers.get('User-Id');

  try {
    const originalGoalListResponse = await sql`SELECT pk, title, achieve_price, content, not_achieve_price, frequency, is_important FROM original_goal where user_id=${user_id}`;
    const todayHistoryResponse = await sql`SELECT * FROM today_goal_history where user_id=${user_id}`;

    const originalGoalList = rearrangeImportantGoalList(originalGoalListResponse.rows as Goal[]);
    const historyFromDB = todayHistoryResponse.rows[0] as GoalFullResponse['todayHistory'] | undefined;

    if (!historyFromDB) {
      return Response.json({
        originalGoalList,
        todayHistory: DEFAULT_GOAL_RESPONSE.todayHistory,
        todayGoalList: getTodayGoalFilterFrequency(originalGoalList),
        todayFrequency: getTodayFrequency()
      });
    }

    historyFromDB.checked_timestamp = Number(historyFromDB.checked_timestamp);
    const isPast = dayjs().diff(new Date(dayjs(historyFromDB.checked_timestamp).format('YYYY-MM-DD')), 'day') > 0;
    const todayHistory = (!historyFromDB || isPast) ? DEFAULT_GOAL_RESPONSE.todayHistory : historyFromDB;

    return Response.json({
      originalGoalList,
      todayHistory,
      todayGoalList: todayHistory.has_checked ? [] : getTodayGoalFilterFrequency(originalGoalList),
      todayFrequency: getTodayFrequency()
    });
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    })
  }
}

export async function POST(request: NextRequest) {
  const checkedGoalList: CheckableGoal[] = await request.json();
  const user_id = request.headers.get('User-Id');

  // 동적 SQL 쿼리 문자열 초기화
  let query = `UPDATE original_goal AS og SET is_important = CASE`;

  // 매개변수 배열 초기화
  const params: (number | boolean)[] = [];

  // 각 데이터를 순회하며 CASE WHEN 절 추가
  checkedGoalList.forEach(({ pk, checked }, index) => {
    query += ` WHEN og.pk = $${index * 2 + 1} THEN $${index * 2 + 2}`;
    params.push(pk, !checked); // checked가 true면 false로, false면 true로 설정
  });

  // SQL 쿼리 마무리
  query += ` ELSE og.is_important END WHERE og.pk IN (`;
  query += checkedGoalList.map((_, index) => `$${index * 2 + 1}`).join(', ');
  query += `)`;

  // 템플릿 리터럴을 사용하여 쿼리 실행
  try {
    await sql`DELETE FROM today_goal_history where user_id=${user_id}`;

    await sql`
      INSERT INTO today_goal_history (checked_timestamp, has_checked, checked_list, total_price, user_id)
      VALUES (${Date.now()}, true, ${JSON.stringify(checkedGoalList)}, ${calculateTotal(checkedGoalList)}, ${user_id})`;

    await sql.query(query, params);

    return new Response('');
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    })
  }
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
function calculateTotal(checkedGoalList: CheckableGoal[]) {
  return checkedGoalList.reduce((a, b) => {
    if (b.checked) {
      return a + b.achieve_price;
    } else {
      return a - b.not_achieve_price;
    }
  }, 0);
}

// 평일인지 주말인지 매달인지 판단하는 기준값을 반환
function getTodayFrequency(): GoalFrequency {
  const value = new Date();

  if (value.getDate() === 1) {
    return 'Monthly';
  }

  if (value.getDay() === 0) {
    return 'Weekly';
  }

  return 'Daily';
}

/**
 * 평일이면 Daily만, 주말이면 Daily + Weekly까지, 매달초면 Daily+Weekly+Monthly 모두 합쳐서 반환
 * 주말에는 평일것까지, 매달마다는 평일,주말것 까지 같이 검토하기위함
 */
function getTodayGoalFilterFrequency(goalList: Goal[]): Goal[] {
  const todayFilter = getTodayFrequency();
  let result: Goal[] = [];

  const goalRecord = goalList.reduce((a, b) => {
    a[b.frequency].push(b);
    return a;
  }, {Daily: [], Monthly: [], Weekly: []} as Record<GoalFrequency, Goal[]>);

  if (todayFilter === 'Monthly') {
    result = result.concat(goalRecord.Monthly);
  }

  if (todayFilter === 'Weekly') {
    result = result.concat(goalRecord.Weekly);
  }

  return result.concat(goalRecord.Daily);
}


function rearrangeImportantGoalList(list: Goal[]): Goal[] {
  const {important, normal} = list.reduce((a, b) => {
    if (b.is_important) {
      a.important.push(b);
    } else {
      a.normal.push(b);
    }

    return a;
  }, {
    normal: [] as Goal[],
    important: [] as Goal[]
  });

  return important.concat(normal);
}

const DEFAULT_GOAL_RESPONSE: GoalFullResponse = {
  originalGoalList: [],
  todayHistory: {
    has_checked: false,
    checked_list: [],
    checked_timestamp: undefined,
    total_price: 0
  },
  todayGoalList: [],
  todayFrequency: 'Daily'
};
