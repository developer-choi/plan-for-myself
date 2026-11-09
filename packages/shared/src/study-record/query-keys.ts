export const studyRecordQueryKeys = {
  list: (month: string) => ['study-records', month] as const,
  stats: () => ['study-record-stats'] as const,
};
