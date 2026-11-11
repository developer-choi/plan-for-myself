import 'server-only';
import {createStudyRecordApi} from '@plan-for-myself/shared/study-record';
import {createStudyRecordQueries} from '@plan-for-myself/shared/study-record/react';
import {createStudyRecordStatsQueries} from '@plan-for-myself/shared/study-record-stats/react';
import {serverApiClient} from '@/shared/api/server-client';

const serverStudyRecordApi = createStudyRecordApi(serverApiClient);

export const serverStudyRecordQueries = createStudyRecordQueries(serverStudyRecordApi);

export const serverStudyRecordStatsQueries = createStudyRecordStatsQueries(serverStudyRecordApi);
