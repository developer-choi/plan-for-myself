import type {CheckableGoal, Goal, GoalFrequency} from '@type/goal';
import type {GoalFullResponse, PostGoalRequestParameter} from '@type/goal-server';
import dayjs from 'dayjs';

/*************************************************************************************************************
 * Exported functions
 *************************************************************************************************************/
export function createGoal(goal: PostGoalRequestParameter) {
  const {originalGoalList, ...rest} = getGoalFullResponse();
  setGoalResponse({
    ...rest,
    originalGoalList: originalGoalList.concat({
      ...goal,
      pk: new Date().getTime(),
      notAchievePrice: goal.notAchievePrice ?? 0,
    })
  });
}

export function deleteGoal(goal: Goal) {
  const {originalGoalList, ...rest} = getGoalFullResponse();

  setGoalResponse({
    ...rest,
    originalGoalList: originalGoalList.filter(({pk}) => goal.pk !== pk)
  });
}

export function updateGoal(previousGoal: Goal, data: PostGoalRequestParameter) {
  deleteGoal(previousGoal);
  createGoal(data);
}

export function checkedTodayGoalList(checkedGoalList: CheckableGoal[]) {
  setGoalResponse({
    originalGoalList: checkedGoalList.map(({checked, isImportant, ...rest}) => ({
      ...rest,
      isImportant: isImportant ? isImportant : !checked
    })),
    todayHistory: {
      checkedList: checkedGoalList,
      hasChecked: true,
      checkedTimestamp: new Date().getTime(),
      totalPrice: calculateTotal(checkedGoalList)
    }
  });
}

export function getGoalFullResponse(): GoalFullResponse {
  const item = localStorage.getItem(STORAGE_KEY);

  if (item === null) {
    return DEFAULT_GOAL_RESPONSE;
  }

  try {
    const response = JSON.parse(item) as StoredGoalResponse;
    const isPast = dayjs().diff(new Date(dayjs(response.todayHistory.checkedTimestamp).format('YYYY-MM-DD')), 'day') > 0;

    if (isPast) {
      setGoalResponse({
        originalGoalList: response.originalGoalList,
        todayHistory: DEFAULT_GOAL_RESPONSE.todayHistory
      });
    }

    return {
      todayHistory: isPast ? DEFAULT_GOAL_RESPONSE.todayHistory : response.todayHistory,
      originalGoalList: rearrangeImportantGoalList(response.originalGoalList),
      todayGoalList: getTodayGoalFilterFrequency(response.originalGoalList),
      todayFrequency: getTodayFrequency()
    };
  } catch (error) {
    console.error(error);
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_GOAL_RESPONSE;
  }
}

export function initializeGoalList(data: string) {
  const goalList = JSON.parse(data) as Goal[];
  setGoalResponse({
    originalGoalList: goalList,
    todayHistory: DEFAULT_GOAL_RESPONSE.todayHistory
  });
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
const STORAGE_KEY = 'goal-storage';

type StoredGoalResponse = Pick<GoalFullResponse, 'originalGoalList' | 'todayHistory'>

const DEFAULT_GOAL_RESPONSE: GoalFullResponse = {
  originalGoalList: [],
  todayHistory: {
    hasChecked: false,
    checkedList: [],
    checkedTimestamp: undefined,
    totalPrice: 0
  },
  todayGoalList: [],
  todayFrequency: 'Daily'
};

function calculateTotal(checkedGoalList: CheckableGoal[]) {
  return checkedGoalList.reduce((a, b) => {
    if (b.checked) {
      return a + b.achievePrice;
    } else {
      return a - b.notAchievePrice;
    }
  }, 0);
}

function setGoalResponse(response: StoredGoalResponse) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
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
    if (b.isImportant) {
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
