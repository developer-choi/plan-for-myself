import {createStudyRecordQueries} from '@plan-for-myself/shared/study-record/react';
import {createStudyRecordStatsQueries} from '@plan-for-myself/shared/study-record-stats/react';
import {studyRecordApi} from '@/study-record/api';

export const studyRecordQueries = createStudyRecordQueries(studyRecordApi);

export const studyRecordStatsQueries = createStudyRecordStatsQueries(studyRecordApi);
