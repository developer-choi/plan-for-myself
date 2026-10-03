import type {DateType} from '../date-type/type';

export interface StudyRecord {
  pk: number;
  dateType: DateType;
  studiedMinutes: [morning: number, afternoon: number, evening: number];
  failTags: string[];
  timestamp: number;
}
