import type {CheckableGoal, ContinuousGoal, Goal} from '@type/goal';
import type {ContinuousGoalHistory} from '@type/goal';
import type {GoalResponse, PostGoalRequestParameter} from '@type/goal-server';
import {getDiffBetweenDate} from '@util/extend/date-util';

/*************************************************************************************************************
 * Exported functions
 *************************************************************************************************************/
export function createGoal(goal: PostGoalRequestParameter) {
  const {goalList, ...rest} = getGoalResponse();
  setGoalResponse({
    ...rest,
    goalList: goalList.concat({
      ...goal,
      pk: new Date().getTime(),
      notAchievePrice: goal.notAchievePrice ?? 0,
    })
  })
}

export function checkedTodayGoalList(checkedGoalList: CheckableGoal[]) {
  const previousResponse = getGoalResponse();

  setGoalResponse({
    goalList: previousResponse.goalList,
    continuousGoalHistory: calculateContinuousGoal(previousResponse, checkedGoalList),
    checkedGoalHistoryList: [
      {
        checkedGoalList,
        createdTimestamp: new Date().getTime(),
        totalPrice: calculateTotal(checkedGoalList)
      },
      ...previousResponse.checkedGoalHistoryList
    ],
    accumulateGoalRate: calculateAccumulateRate(previousResponse, checkedGoalList)
  });
}

export function getGoalResponse(): GoalResponse {
  const item = localStorage.getItem(STORAGE_KEY);

  if (item === null) {
    return DEFAULT_GOAL_RESPONSE;
  }

  try {
    const response = JSON.parse(item) as StoredGoalResponse;
    const latestCreatedTimestamp = response.checkedGoalHistoryList[0]?.createdTimestamp as number | undefined;

    return {
      ...response,
      hasCheckedToday: !latestCreatedTimestamp ? false : getDiffBetweenDate(new Date().getTime(), latestCreatedTimestamp) === 0
    }
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

type StoredGoalResponse = Omit<GoalResponse, 'hasCheckedToday'>

const DEFAULT_GOAL_RESPONSE: GoalResponse = {
  goalList: [],
  accumulateGoalRate: 0,
  checkedGoalHistoryList: [],
  continuousGoalHistory: undefined,
  hasCheckedToday: false
};

/** 연속날짜 계산규칙 (처음부터 모든기록을 다 뒤져서 계산하는 방법)
 * 1. 첫 번째 히스토리가 오늘꺼도 아니고 어제꺼도 아니면 0일
 * 2. 첫 번째 히스토리의 history에 있는 checkedGoalList에서 enable true인걸 간추려서
 * 3. 그 이전 히스토리에 pk 같고 / checked true면 +1일씩 추가
 * 4. 그렇게 계속 전날의 전날의 히스토리를 찾아서 매칭되는게 하나도 없을 때 까지 배열 순회
 *
 * 하지만 매일 매번 과거의 기록까지 연산하는것을 방지하기위해,
 * 그날그날 기준 계산한 값을 continuousGoalList에 저장하기로 결정
 */
export function calculateContinuousGoal(previousResponse: GoalResponse, checkedGoalList: CheckableGoal[]): ContinuousGoalHistory | undefined {
  const currentTimestamp = new Date().getTime();
  const continuousGoalList: ContinuousGoal[] = checkedGoalList.reduce<ContinuousGoal[]>((a, b) => {
    if (!b.checked || !b.enableContinuous) {
      return a;
    }

    const previous = previousResponse.continuousGoalHistory;
    const findResult = previous?.continuousGoalList.find(({pk}) => pk === b.pk);
    const diff = !previous ? undefined : getDiffBetweenDate(currentTimestamp, previous.createdTimestamp);

    /**
     * 1. 기존 기록이 없거나,
     * 2. 기존 기록이 오늘과 하루이상 차이가 나면 오늘부터 1일 연속으로 판단
     */
    if (!previous || !findResult || diff !== 1) {
      return a.concat({
        pk: b.pk,
        title: b.title,
        continuousDate: 1
      });
    } else {
      return a.concat({
        pk: findResult.pk,
        title: findResult.title,
        continuousDate: findResult.continuousDate + 1
      });
    }
  }, []);

  if (continuousGoalList.length === 0) {
    return undefined;
  } else {
    return {
      continuousGoalList,
      createdTimestamp: currentTimestamp
    };
  }
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

function calculateAccumulateRate(previousResponse: GoalResponse, checkedGoalList: CheckableGoal[]) {
  const achieveList = checkedGoalList.filter(({checked}) => checked);
  const todayRate = achieveList.length * 100 / checkedGoalList.length;
  return Math.floor((previousResponse.accumulateGoalRate * previousResponse.checkedGoalHistoryList.length + todayRate) / (previousResponse.checkedGoalHistoryList.length + 1));
}

function setGoalResponse(response: StoredGoalResponse) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
}
