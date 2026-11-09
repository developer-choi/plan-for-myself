import {createStudyRecordApi} from '@plan-for-myself/shared';
import {apiClient} from '@/shared/api/client';

export const studyRecordApi = createStudyRecordApi(apiClient);
