import {createStudyRecordApi} from '@plan-for-myself/shared/study-record';
import {apiClient} from '@/shared/api/client';

export const studyRecordApi = createStudyRecordApi(apiClient);
