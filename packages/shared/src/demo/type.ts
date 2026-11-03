import type {StudyRecord, StudyRecordMonthly, StudyRecordOverview} from '../study-record/type';

export type DemoOverview = StudyRecordOverview & {firstRecordDate: string};

export interface GetDemoApiRequest {
  month?: string;
}

export interface GetDemoApiResponse {
  today: string;
  records: StudyRecord[];
  overview: DemoOverview;
  /* 미래 달이거나 첫 기록 달보다 앞선 달이면 null */
  monthly: StudyRecordMonthly | null;
}
