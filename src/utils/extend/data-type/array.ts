export function arraySplit<T>(list: T[], length: number): T[][] {
  const resultArray: T[][] = [];
  const resultLength = Math.ceil(list.length / length);

  for(let i = 0; i < resultLength; i++) {
    resultArray.push(list.slice(i * length, (i + 1) * length));
  }

  return resultArray;
}

export type Direction = 'asc' | 'desc';

export function sortByNumber<T>(direction: Direction, list: T[], valueExtractor: (item: T) => number) {
  return [...list].sort((a, b) => {
    if (direction === 'asc') {
      return valueExtractor(a) - valueExtractor(b);

    } else {
      return valueExtractor(b) - valueExtractor(a);
    }
  });
}

export function removeDuplicatedItems<T extends string | number>(array: T[]): T[] {
  return Array.from(new Set(array));
}
