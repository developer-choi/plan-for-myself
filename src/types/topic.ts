export type TopicCategory = 'LONG_TERM' | 'SHORT_TERM' | 'CONSTANT';

export interface Topic {
  id: number;
  content: string;
  category: TopicCategory;
}
