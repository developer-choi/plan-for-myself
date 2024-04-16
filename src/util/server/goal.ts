import type {CheckableGoal, Goal, GoalFrequency} from '@type/goal';
import type {GoalFullResponse, PostGoalRequestParameter} from '@type/goal-server';

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
  const previousResponse = getGoalFullResponse();
  setGoalResponse({
    ...previousResponse,
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

    //@ts-ignore
    if (response.checkedGoalHistoryList) {
      setGoalResponse({
        todayHistory: {
          totalPrice: 0,
          checkedList: [],
          hasChecked: false,
          checkedTimestamp: undefined
        },
        //@ts-ignore
        originalGoalList: response.goalList,
      });
    }

    return {
      ...response,
      todayGoalList: getTodayGoalFilterFrequency(response.originalGoalList),
    };
  } catch (error) {
    console.error(error);
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_GOAL_RESPONSE;
  }
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
const STORAGE_KEY = 'goal-storage';

type StoredGoalResponse = Omit<GoalFullResponse, 'todayGoalList'>

const DEFAULT_GOAL_RESPONSE: GoalFullResponse = {
  originalGoalList: [],
  todayGoalList: [],
  todayHistory: {
    hasChecked: false,
    checkedList: [],
    checkedTimestamp: undefined,
    totalPrice: 0
  }
};

function forceResetCheckedHistory() {
  const previous = getGoalFullResponse();

  const newData: GoalFullResponse = {
    ...DEFAULT_GOAL_RESPONSE,
    originalGoalList: previous.originalGoalList,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
}

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

function getTodayGoalFilterFrequency(goalList: Goal[]): Goal[] {
  const value = new Date();
  let result: Goal[] = [];

  const goalRecord = goalList.reduce((a, b) => {
    a[b.frequency].push(b);
    return a;
  }, {Daily: [], Monthly: [], Weekly: []} as Record<GoalFrequency, Goal[]>);

  // Monthly
  if (value.getDate() === 1) {
    result = result.concat(goalRecord.Monthly);
  }

  // 일요일, Weekly
  if (value.getDay() === 0) {
    result = result.concat(goalRecord.Weekly);
  }

  return result.concat(goalRecord.Daily);
}
