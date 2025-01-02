export function calculateTotal<T>(list: T[], callback: (item: T) => number) {
  return list.reduce((a, b) => {
    return a + callback(b);
  }, 0);
}

/**
 * @return from, to 사이의 자연수를 배열로 만들어 반환. from, to의 경계도 포함.
 * @example (-1, 4) => [-1, 0, 1, 2, 3, 4]
 * @example (4, -1) => [4, 3, 2, 1, 0, -1]
 */
export function range(from: number, to: number): number[] {
  const max = Math.max(from, to);
  const min = Math.min(from, to);
  const length = max - min + 1;

  if (from > to)
    return [...new Array(length).keys()].map(num => num + min).reverse();

  else
    return [...new Array(length).keys()].map(num => num + min);
}

export function getAbsoluteValueWithSign(value: number) {
  const absoluteValue = Math.abs(value);
  const signType = value >= 0 ? 'positive' : 'negative';

  return {
    signType, // 클래스에 전달해서 양/음 스타일링 할 때 사용

    // 화면에 렌더링 할 때 사용
    absoluteValue, // 그중 숫자 부분만 따로 형식을 바꿀 때 사용 (3자리 마다 콤마를 끊거나 등)
    sign: signType === 'positive' ? '+' : '-',
  };
}
