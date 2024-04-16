import type {CheckableGoal, Goal, GoalFrequency} from '@type/goal';
import type {GoalFullResponse, PostGoalRequestParameter} from '@type/goal-server';
import {getDiffBetweenDate} from '@util/extend/date-util';

/*************************************************************************************************************
 * Exported functions
 *************************************************************************************************************/
export function createGoal(goal: PostGoalRequestParameter) {
  const {goalList, ...rest} = getGoalFullResponse();
  setGoalResponse({
    ...rest,
    goalList: goalList.concat({
      ...goal,
      pk: new Date().getTime(),
      notAchievePrice: goal.notAchievePrice ?? 0,
    })
  });
}

export function deleteGoal(goal: Goal) {
  const {goalList, ...rest} = getGoalFullResponse();

  setGoalResponse({
    ...rest,
    goalList: goalList.filter(({pk}) => goal.pk !== pk)
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
    checkedGoalHistoryList: [
      {
        checkedGoalList,
        createdTimestamp: new Date().getTime(),
        totalPrice: calculateTotal(checkedGoalList)
      },
      ...previousResponse.checkedGoalHistoryList
    ]
  });
}

export function getGoalFullResponse(): GoalFullResponse {
  const item = localStorage.getItem(STORAGE_KEY);

  if (item === null) {
    return DEFAULT_GOAL_RESPONSE;
  }

  try {
    const response = JSON.parse(item) as StoredGoalResponse;
    const latestCreatedTimestamp = response.checkedGoalHistoryList[0]?.createdTimestamp as number | undefined;

    return {
      ...response,
      todayCheckGoalList: getTodayGoalFilterFrequency(response.goalList),
      hasCheckedToday: !latestCreatedTimestamp ? false : getDiffBetweenDate(new Date().getTime(), latestCreatedTimestamp) === 0
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

type StoredGoalResponse = Omit<GoalFullResponse, 'hasCheckedToday'>

const DEFAULT_GOAL_RESPONSE: GoalFullResponse = {
  goalList: [],
  checkedGoalHistoryList: [],
  hasCheckedToday: false,
  todayCheckGoalList: []
};

function forceResetCheckedHistory() {
  const previous = getGoalFullResponse();

  const newData: GoalFullResponse = {
    ...DEFAULT_GOAL_RESPONSE,
    goalList: previous.goalList,
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
