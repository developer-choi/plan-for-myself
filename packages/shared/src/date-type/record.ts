import type {DateType} from './type';

export function listToDateTypeRecord<T extends {date_type: DateType}>(list: T[]): Record<DateType, T[]> {
  return list.reduce((a, b) => {
    a[b.date_type].push(b);
    return a;
  }, {
    weekday: [] as T[],
    holiday: [] as T[]
  });
}
