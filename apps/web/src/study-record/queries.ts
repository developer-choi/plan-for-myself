import {createStudyRecordQueries, createStudyRecordStatsQueries} from '@plan-for-myself/shared';
import {studyRecordApi} from '@/study-record/api';

export const studyRecordQueries = createStudyRecordQueries(studyRecordApi);

export const studyRecordStatsQueries = createStudyRecordStatsQueries(studyRecordApi);
