import type {DateType} from './type';

export function listToDateTypeRecord<T extends {date_type: DateType}>(list: T[]): Record<DateType, T[]> {
  return list.reduce(
    (grouped, item) => {
      grouped[item.date_type].push(item);
      return grouped;
    },
    {
      weekday: [] as T[],
      holiday: [] as T[],
    },
  );
}
