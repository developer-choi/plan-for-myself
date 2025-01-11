/*************************************************************************************************************
 * Exported functions
 *************************************************************************************************************/
/**
 * @param date1 비교할 Date1
 * @param date2 비교할 Date2
 * @param sameDepth 비교할 깊이 [연, 월, 일, 시, 분, 초, 밀리초] 순서로 몇개까지 일치해야 일치하다고 판단할 값
 */
export function isSameDate(date1: Date, date2: Date, sameDepth = 3): boolean {
  const date1Properties = getDatePropertyArray(date1).slice(0, sameDepth);
  const date2Properties = getDatePropertyArray(date2).slice(0, sameDepth);
  return date1Properties.every((value, index) => value === date2Properties[index]);
}

export interface SimpleDate {
  year: number;
  month: number;
  date: number;
}

export interface DateProperty {
  year: number
  month: number
  date: number
  hour: number
  minute: number
  second: number
  milliSecond: number;
}

// 주의 : month는 실제 month보다 1 작습니다. 0부터 시작하기 때문입니다.
export function destructDate(target = new Date()): DateProperty {
  const year = target.getFullYear();
  const month = target.getMonth();
  const date = target.getDate();
  const hour = target.getHours();
  const minute = target.getMinutes();
  const second = target.getSeconds();
  const milliSecond = target.getMilliseconds();
  return {year, month, date, hour, minute, second, milliSecond};
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
/**
 * @param target 지정한 Date객체의 (기본값 : 함수가 호출된 현재에 대한 Date객체)
 * @return year, month, date, hour, minute, second, milliSecond 순서대로 저장된 배열을 반환합니다.
 * @example (new Date('2021-04-03 12:34:56')) => [2021, 3, 3, 12, 34, 56, 0]
 *
 * 주의 : month는 실제 month보다 1 작습니다. 0부터 시작하기 때문입니다.
 */
export function getDatePropertyArray(target = new Date()): [number, number, number, number, number, number, number] {
  const {year, month, date, hour, minute, second, milliSecond} = destructDate(target);
  return [year, month, date, hour, minute, second, milliSecond];
}

export type DateConstructorNumbers = Parameters<DateConstructor>;
export type DateConstructorNumbersLength = 2 | 3 | 4 | 5 | 6 | 7;

/**
 * @param target 기준날짜 (기본값은 현재)
 * @param diffs 기준일날짜기준 n(연, 월, 일, 시, 분, 초, 밀리초) 전/후 차이값배열
 * @param datePropertyLength 반환될 Date객체에 적용할 target Date의 property 길이 (연, 월, 일, 시, 분, 초, 밀리초 순서대로)
 * @return 기준일 기준 연 월 일 시 분 초 밀리초 차이만큼의 Date객체 반환
 * @example (new Date(), [2, 10, -10], 3) => 현재날짜 기준 +2년, +10월, -10일 기준 Date객체 반환하는데 연, 월, 일 까지만 현재날짜를 따라가고 시 분 초 밀리초는 0으로 설정됨.
 */
export function getDiffDate(target: Date, diffs: number[], datePropertyLength?: DateConstructorNumbersLength): Date {
  const targetDateProperties = getDatePropertyArray(target);

  const _diffs = new Array(7).fill(0).map((_, index) => {
    if (index < diffs.length) {
      return diffs[index];
    } else {
      return 0;
    }
  });

  const dateProperties = _diffs.reduce((a, b, index) => {
    // eslint-disable-next-line no-param-reassign
    a[index] += b;
    return a;
  }, targetDateProperties);

  return new Date(...dateProperties.slice(0, datePropertyLength ?? _diffs.length) as DateConstructorNumbers);
}
