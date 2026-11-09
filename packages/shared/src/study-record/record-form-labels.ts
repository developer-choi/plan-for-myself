import {STUDY_RECORD_FIELD_LIMITS} from './limits';

export const RECORD_FORM_LABELS = {
  dateType: '평일 / 휴일',
  weekday: '평일',
  holiday: '휴일',
  failTags: '실패 태그',
  failTagPlaceholder: '단어 하나 입력 후 Enter',
  fullFailTagsPlaceholder: `최대 ${STUDY_RECORD_FIELD_LIMITS.failTags.maxCount}개까지`,
  minutes: '공부시간',
  minutePlaceholder: '0',
  minuteSuffix: '분',
  save: '저장',
  delete: '삭제',
};
