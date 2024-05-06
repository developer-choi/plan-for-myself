/*************************************************************************************************************
 * Exported functions
 *************************************************************************************************************/

/**
 * Weekly Routine을 돌릴 수 있는 주가 "올해" 몇주 남았는지 계산
 * Weekly Routine = 월화수목금토일 7일 루틴
 *
 * 1. 주말이 내년이면 그 주 미포함
 * 2. 오늘이 월요일이면 이번 주도 포함
 */
export function getRemainWeek(value: Date) {
  const thisYear = new Date().getFullYear();

  let date = getNextWeekMonday(value);
  let remainCount = value.getDay() === 1 && getThisWeekSunday(value).getFullYear() === thisYear ? 1 : 0;

  while (getThisWeekSunday(date).getFullYear() === thisYear) {
    date = getNextWeekMonday(date);
    remainCount++;
  }

  return remainCount;
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
function getNextWeekMonday(value: Date) {
  const {year, month, date} = destructDate(value);
  /**
   * 0이면 1더하고
   * 1이면 7더하고
   * 2이면 6더하고
   */
  const diffDate = value.getDay() === 0 ? 1 : 8 - value.getDay();
  return new Date(year, month, date + diffDate, 9);
}

function getThisWeekSunday(value: Date) {
  const {year, month, date} = destructDate(value);
  /**
   * 0이면 0더하고
   * 1이면 6더하고
   * 2이면 5더하고
   */
  const diffDate = value.getDay() === 0 ? 0 : 7 - value.getDay();
  return new Date(year, month, date + diffDate, 9);
}

// 주의 : month는 실제 month보다 1 작습니다. 0부터 시작하기 때문입니다.
function destructDate(target = new Date()) {
  const year = target.getFullYear();
  const month = target.getMonth();
  const date = target.getDate();
  const hour = target.getHours();
  const minute = target.getMinutes();
  const second = target.getSeconds();
  const milliSecond = target.getMilliseconds();
  return {year, month, date, hour, minute, second, milliSecond};
}
