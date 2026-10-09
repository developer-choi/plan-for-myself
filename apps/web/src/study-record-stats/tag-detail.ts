import type {FailureTagTrend} from '@plan-for-myself/shared';

export interface TrendBar {
  label: string;
  value: number;
  status: FailureTagTrend['status'];
}
