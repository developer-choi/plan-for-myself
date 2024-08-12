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
  return getDiffDayInWeek(value, 1, 1);
}

function getThisWeekSunday(value: Date) {
  return getDiffDayInWeek(value, 0, 0);
}

/**
 * a날짜 기준 b주 전/후 c요일 구하기
 * 1 = 월요일
 * 6 = 토요일
 * 0 = 일요일
 */
function getDiffDayInWeek(value: Date, diff: number, day: 1 | 2 | 3 | 4 | 5 | 6 | 0) {
  const {year, month, date, hour, minute, second, milliSecond} = destructDate(value);

  /**
   * 일단 먼저 월요일 기준 계산
   * 0이면 1더하고
   * 1이면 7더하고
   * 2이면 6더하고
   */
  const diffDate = value.getDay() === 0 ? 1 : 8 - value.getDay();

  /**
   * 구하고싶은 날짜가
   * 월요일이면 0 더하고
   * 화요일이면 1 더하고
   * ...
   * 일요일이면 6 더하고
   */
  const diffDays = day === 0 ? 6 : day - 1;

  const diffWeekDates = (diff - 1) * 7;
  return new Date(year, month, date + diffDate + diffWeekDates + diffDays, hour, minute, second, milliSecond);
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
