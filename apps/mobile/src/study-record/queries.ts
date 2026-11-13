import {createStudyRecordQueries} from '@plan-for-myself/shared/study-record';
import {createStudyRecordStatsQueries} from '@plan-for-myself/shared/study-record-stats';
import {studyRecordApi} from '@/study-record/api';

export const studyRecordQueries = createStudyRecordQueries(studyRecordApi);

export const studyRecordStatsQueries = createStudyRecordStatsQueries(studyRecordApi);
