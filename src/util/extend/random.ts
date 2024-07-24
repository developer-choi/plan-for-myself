/**
 * @example (0, 3) --> -2이상 3이하의 랜덤한 숫자 반환
 * @example (3, -2) --> -2이상 3이하의 랜덤한 숫자 반환
 */
export function randomNumber(from: number, to: number) {
  const _max = Math.max(from, to);
  const _min = Math.min(from, to);
  const length = Math.abs(_max - _min) + 1;
  return Math.floor(Math.random() * length) + _min;
}

export function randomIndex(array: any[]): number {
  return randomNumber(0, array.length - 1);
}

export function randomInArray<T>(array: T[]): T {
  const index = randomIndex(array);
  return array[index];
}
