import type {DateType} from './type';

export function listToDateTypeRecord<T extends {dateType: DateType}>(list: T[]): Record<DateType, T[]> {
  return list.reduce(
    (grouped, item) => {
      grouped[item.dateType].push(item);
      return grouped;
    },
    {
      weekday: [] as T[],
      holiday: [] as T[],
    },
  );
}
