export type TopicCategory = 'SHORT_TERM' | 'LONG_TERM' | 'CONSTANT';

export interface Topic {
  id: number;
  content: string;
  category: TopicCategory;
}
