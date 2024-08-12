export function arraySplit<T>(list: T[], length: number): T[][] {
  const resultArray: T[][] = [];
  const resultLength = Math.ceil(list.length / length);

  for(let i = 0; i < resultLength; i++) {
    resultArray.push(list.slice(i * length, (i + 1) * length));
  }

  return resultArray;
}
