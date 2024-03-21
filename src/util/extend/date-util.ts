export interface DestructedDate {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  second: number;
  milliSecond: number;
}

// 주의 : month는 실제 month보다 1 작습니다. 0부터 시작하기 때문입니다.
export function destructDate(target = new Date()): DestructedDate {
  const year = target.getFullYear();
  const month = target.getMonth();
  const date = target.getDate();
  const hour = target.getHours();
  const minute = target.getMinutes();
  const second = target.getSeconds();
  const milliSecond = target.getMilliseconds();
  return { year, month, date, hour, minute, second, milliSecond };
}

export function getDatePropertyArray(target = new Date()): [number, number, number, number, number, number, number] {
  const {year, month, date, hour, minute, second, milliSecond} = destructDate(target);
  return [year, month, date, hour, minute, second, milliSecond];
}

//두 날짜간에 몇'일'차이나는지 계산, 시간은 무시
export function getDiffBetweenDate(a: number, b: number) {
  const [aYear, aMonth, aDate] = getDatePropertyArray(new Date(a));
  const [bYear, bMonth, bDate] = getDatePropertyArray(new Date(b));

  const aTimestamp = new Date(`${aYear}-${(aMonth + 1).toString().padStart(2, '0')}-${aDate.toString().padStart(2, '0')}`).getTime();
  const bTimestamp = new Date(`${bYear}-${(bMonth + 1).toString().padStart(2, '0')}-${bDate.toString().padStart(2, '0')}`).getTime();

  return (aTimestamp - bTimestamp) / 1000 / 3600 / 24;
}
