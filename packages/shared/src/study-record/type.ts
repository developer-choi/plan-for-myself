import type {DateType} from '../date-type/type';

export interface StudyRecord {
  pk: number;
  date: string;
  dateType: DateType;
  studiedMinutes: [morning: number, afternoon: number, evening: number];
  failTags: string[];
}
