import {NextRequest} from 'next/server';
import {sql} from '@vercel/postgres';
import type {CheckableHabit, Habit, HabitFrequency} from '@/types/habit';
import dayjs from 'dayjs';
import type {HabitFullResponse} from '@/types/habit';
import {isHolidayDate} from '@/utils/extend/date/holiday';

/**
 * 기능 = 내 습관목록, 오늘 체크한거 히스토리, 오늘 체크할 습관목록, 오늘의 빈도값 가져오기
 * 401 = user_id가 헤더에 없거나, 존재하지 않는 회원
 */
export async function GET(request: NextRequest) {
  const user_id = request.headers.get('User-Id');

  try {
    const originalHabitListResponse = await sql`SELECT pk, title, memo, frequency_list, children FROM original_habit where user_id=${user_id}`;
    const todayHistoryResponse = await sql`SELECT * FROM today_habit_history where user_id=${user_id}`;

    const originalHabitList = rearrangeImportantHabitList(originalHabitListResponse.rows as Habit[]).map(({children, ...rest}) => ({
      ...rest,
      children,
      has_important: children.some(({is_important}) => is_important)
    }));

    const historyFromDB = todayHistoryResponse.rows[0] as HabitFullResponse['todayHistory'] | undefined;

    if (!historyFromDB) {
      return Response.json({
        originalHabitList,
        todayHistory: DEFAULT_HABIT_RESPONSE.todayHistory,
        todayHabitList: getTodayHabitFilterFrequency(originalHabitList),
        todayFrequency: getTodayFrequency()
      });
    }

    historyFromDB.checked_timestamp = Number(historyFromDB.checked_timestamp);
    const isPast = dayjs().diff(new Date(dayjs(historyFromDB.checked_timestamp).format('YYYY-MM-DD')), 'day') > 0;
    const todayHistory = (!historyFromDB || isPast) ? DEFAULT_HABIT_RESPONSE.todayHistory : historyFromDB;

    return Response.json({
      originalHabitList,
      todayHistory,
      todayHabitList: todayHistory.has_checked ? [] : getTodayHabitFilterFrequency(originalHabitList),
      todayFrequency: getTodayFrequency()
    });
  } catch (error) {
    console.error(error);
    return new Response('', {
      status: 500
    });
  }
}

export async function POST(request: NextRequest) {
  const checkedHabitList: CheckableHabit[] = await request.json();
  const user_id = request.headers.get('User-Id');

  // 템플릿 리터럴을 사용하여 쿼리 실행
  try {
    await sql`DELETE FROM today_habit_history where user_id=${user_id}`;

    await sql`
      INSERT INTO today_habit_history (checked_timestamp, has_checked, checked_list, user_id)
      VALUES (${Date.now()}, true, ${JSON.stringify(checkedHabitList)}, ${user_id})`;

    for (const habit of checkedHabitList) {
      const newChildren = habit.children.map(({checked, title}) => ({
        title,
        is_important: !checked
      }));

      await sql`UPDATE original_habit SET children = ${JSON.stringify(newChildren)} WHERE pk = ${habit.pk}`;
    }

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
// 평일인지 주말인지 매달인지 판단하는 기준값을 반환
function getTodayFrequency(): HabitFrequency {
  const value = new Date();
  const isHoliday = isHolidayDate({
    year: value.getFullYear(),
    month: value.getMonth() + 1,
    date: value.getDate()
  });

  if (isHoliday) {
    return 'holiday';
  }

  return 'weekday';
}

/**
 * 평일이면 Daily만, 주말이면 Weekly꺼만.
 */
function getTodayHabitFilterFrequency(habitList: Habit[]): Habit[] {
  const todayFilter = getTodayFrequency();
  return habitList.filter(({frequency_list}) => frequency_list.includes(todayFilter));
}


function rearrangeImportantHabitList(list: Habit[]): Habit[] {
  const {important, normal} = list.reduce((a, b) => {
    if (b.children.some(({is_important}) => is_important)) {
      a.important.push(b);
    } else {
      a.normal.push(b);
    }

    return a;
  }, {
    normal: [] as Habit[],
    important: [] as Habit[]
  });

  return important.concat(normal);
}

const DEFAULT_HABIT_RESPONSE: HabitFullResponse = {
  originalHabitList: [],
  todayHistory: {
    has_checked: false,
    checked_list: [],
    checked_timestamp: undefined,
  },
  todayHabitList: [],
  todayFrequency: 'weekday'
};
